"use client";

interface TahunFormProps {
  initialData: {
    tahun: string;
  };
  variabelId: string;
};


export const TahunForm = ({
  initialData,
  variabelId
}: TahunFormProps) => {

  return (
    <div className="mt-6 border bg-background rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Tahun
      </div>
        <p className="text-sm mt-2">
          {initialData.tahun}
        </p>      
    </div>
  )
}