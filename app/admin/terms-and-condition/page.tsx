"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { buttonbg } from "@/contexts/theme";
import JoditComponent from "@/components/ui/JoditComponent";
import { useGetTermsAndConditionsQuery, useUpdateTermsAndConditionsMutation } from "@/store/api/termsApi";

export default function TermsAndConditionsPage() {
  const [content, setContent] = useState("");
  const router = useRouter();

  const { data: termsData, isLoading } = useGetTermsAndConditionsQuery({});
  const [updateTerms, { isLoading: isSubmitting }] = useUpdateTermsAndConditionsMutation();

  useEffect(() => {
    if (termsData?.data?.TermsConditions) {
      setContent(termsData.data.TermsConditions);
    } else if (termsData?.data?.description) {
      setContent(termsData.data.description);
    }
  }, [termsData]);

  const handleSubmit = async () => {
    try {
      const res = await updateTerms({ TermsConditions: content }).unwrap();
      if (res?.success) {
        toast.success("Terms & Conditions updated successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div className={`${buttonbg} px-6 py-4 rounded-xl mb-6 flex items-center gap-3 shadow-md shadow-blue-200`}>
        <button
          onClick={() => router.back()}
          className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl sm:text-2xl font-bold">Terms & Conditions</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <JoditComponent content={content} setContent={setContent} />
      </div>

      <div className="text-center pb-10">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`${buttonbg} hover:bg-blue-700 text-white font-semibold w-full md:w-auto md:px-12 py-3 rounded-lg transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto shadow-lg shadow-blue-600/20`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
