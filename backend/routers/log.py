from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Body
# from langchain.chat_models import ChatOpenAI
from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.text_splitter import CharacterTextSplitter
from auth import get_current_user
from fastapi.responses import JSONResponse
from config import settings
import mixins
import os
import shutil
import re


router = APIRouter(prefix="/log", tags=["Log"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        # Save the file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Read the logs
        log_data = mixins.read_log_file(file_path)

        # ===== CREATE PROMPT TEMPLATE =====
        template = """
        You are an expert in analyzing log files. 
        Your job is to:
        1. Identify all ERROR and WARNING messages in the given log content.
        2. Explain each one in simple, non-technical terms so a non-programmer can understand.
        3. Suggest possible causes for each error/warning.
        4. If possible, suggest steps to fix them.

        Log content:
        {log_content}

        Respond in this JSON format:
        [
        {{
            "error_message": "...",
            "explanation": "...",
            "possible_causes": "...",
            "suggested_fixes": "..."
        }}
        ]
        """

        prompt = PromptTemplate(input_variables=["log_content"], template=template)

        # ===== SETUP LLM CHAIN =====
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, api_key=settings.OPENAI_API_KEY)
        chain = LLMChain(llm=llm, prompt=prompt)

        # Split large logs into chunks (so they fit into LLM context)
        splitter = CharacterTextSplitter(separator="\n", chunk_size=2000, chunk_overlap=200)
        chunks = splitter.split_text(log_data)

        results = []
        for chunk in chunks:
            response = chain.run(log_content=chunk)
            results.append(response)

        return JSONResponse(
            content=results
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.post("/ask")
async def ask_log(
    question: str = Body(..., embed=True, description="Your question about the log file"),
    log_filename: str = Body(..., embed=True, description="The log file name to query")
):
    """
    Ask a question about a specific log file. The API will use LLM to answer based on the log content.
    """
    try:
        file_path = os.path.join(UPLOAD_DIR, log_filename)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Log file not found.")

        # Read the logs
        log_data = mixins.read_log_file(file_path)

        # You can customize the prompt as needed
        prompt_template = (
            "You are an expert log analyzer. Given the following log content:\n"
            "{log_content}\n\n"
            "Answer this question: {question}\n"
            "If the answer is not in the log, say so."
        )
        prompt = PromptTemplate(
            input_variables=["log_content", "question"],
            template=prompt_template
        )

        # Setup LLM chain
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, api_key=settings.OPENAI_API_KEY)
        chain = LLMChain(llm=llm, prompt=prompt)

        # Split large logs into chunks
        splitter = CharacterTextSplitter(separator="\n", chunk_size=2000, chunk_overlap=200)
        chunks = splitter.split_text(log_data)

        # Run the question against each chunk and collect answers
        answers = []
        for chunk in chunks:
            answer = chain.run(log_content=chunk, question=question)
            answers.append(answer)

        # Optionally, you can combine or summarize the answers here
        return JSONResponse(content={"answers": answers})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ask failed: {str(e)}")

@router.get("/total-logs")
async def get_total_logs():
    """
    Returns the total number of log entries across all log files in the UPLOAD_DIR.
    Each log entry is counted by lines starting with a timestamp like '10-Nov-23 13:44:02'.
    """
    try:
        total_logs = 0
        # Regex for lines starting with date like 10-Nov-23 13:44:02
        log_line_regex = re.compile(r"^\d{2}-[A-Za-z]{3}-\d{2} \d{2}:\d{2}:\d{2}")

        log_files = [
            f for f in os.listdir(UPLOAD_DIR)
            if os.path.isfile(os.path.join(UPLOAD_DIR, f))
        ]
        for filename in log_files:
            file_path = os.path.join(UPLOAD_DIR, filename)
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    if log_line_regex.match(line):
                        total_logs += 1
        return {"total_logs": total_logs, "files_counted": len(log_files)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to count logs: {str(e)}")

@router.get("/total-debug")
async def get_total_debug():
    """
    Returns the total number of DEBUG lines across all log files in the UPLOAD_DIR.
    """
    try:
        total_debug = 0
        debug_regex = re.compile(r"\bDEBUG\b", re.IGNORECASE)

        log_files = [
            f for f in os.listdir(UPLOAD_DIR)
            if os.path.isfile(os.path.join(UPLOAD_DIR, f))
        ]
        for filename in log_files:
            file_path = os.path.join(UPLOAD_DIR, filename)
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    if debug_regex.search(line):
                        total_debug += 1
        return {"total_debug": total_debug, "files_counted": len(log_files)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to count DEBUG lines: {str(e)}")

