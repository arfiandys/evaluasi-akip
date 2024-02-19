"use client";

interface KodeFormProps {
  initialData: {
    kode: string;
  };
  variabelId: string;
};

export const KodeForm = ({
  initialData,
  variabelId
}: KodeFormProps) => {

  return (
    <div className="mt-6 border bg-background rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Kode
      </div>
        <p className="text-sm mt-2">
          {initialData.kode}
        </p>
    </div>
  )
}