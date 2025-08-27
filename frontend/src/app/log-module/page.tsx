import DashboardLayout from "@/components/DashboardLayout";

const mockResponse = [
  {
    error_message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    explanation:
      "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    possible_causes:
      "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    suggested_fixes:
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
  },
  {
    error_message:
      "Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.",
    explanation:
      'Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance.',
    possible_causes:
      'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
    suggested_fixes:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
  {
    error_message:
      "The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    explanation:
      "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.",
    possible_causes:
      "Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    suggested_fixes:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
  },
];

export default function PathInputPage() {
  return (
    <DashboardLayout>
      <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Enter Module Name
        </h1>
        <form className="space-y-4">
          {/* Text Input for File Path */}
          <div>
            <label
              htmlFor="logPath"
              className="block text-md font-medium text-gray-700 mb-2"
            >
              Log Module
            </label>
            <input
              type="text"
              id="logPath"
              name="logPath"
              placeholder="/module-name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition"
          >
            Submit Path
          </button>
        </form>
      </div>
      {/* Response text or analysis result can be shown here */}
      <div className="mt-6 w-full">
        <div className="mb-4 text-center font-medium font-semibold text-emerald-600">
          Analysis Results
        </div>
        <div className="space-y-8 w-full">
          {mockResponse.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-blue-50 border border-blue-200 rounded-lg shadow w-full"
            >
              <div className="mb-2">
                <span className="font-semibold text-blue-700">
                  Error Message:
                </span>
                <div className="text-base text-blue-700">
                  {item.error_message}
                </div>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-emerald-700">
                  Explanation:
                </span>
                <div className="text-base text-emerald-700">
                  {item.explanation}
                </div>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-orange-700">
                  Possible Causes:
                </span>
                <div className="text-base text-orange-700">
                  {item.possible_causes}
                </div>
              </div>
              <div>
                <span className="font-semibold text-pink-700">
                  Suggested Fixes:
                </span>
                <div className="text-base text-pink-700">
                  {item.suggested_fixes}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
