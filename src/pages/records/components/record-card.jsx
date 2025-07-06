import React from "react";
import { IconChevronRight, IconFolder } from "@tabler/icons-react";

const RecordCard = ({ record, onNavigate, numFiles }) => {
  return (
    <div className="flex flex-col rounded-xl border bg-white shadow-sm dark:border-neutral-800 dark:bg-[#13131a]">
      <div className="flex justify-between gap-x-3 p-4 md:p-5">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-white dark:text-blue-200">
          <IconFolder size={70} className="text-green-500" />
        </div>
      </div>

      <a
        onClick={() => onNavigate(record.recordName)}
        className="inline-flex cursor-pointer items-center justify-between rounded-b-xl border-t border-gray-200 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 md:px-5 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
      >
        {record.recordName}
        <IconChevronRight />
      </a>

      <div className="p-4">
        <div className="text-xs text-gray-400">
          Created: {record.createdAt ? new Date(record.createdAt).toLocaleString() : "Unknown"}
        </div>
        <div className="text-xs text-green-400 font-semibold">
          Files: {typeof numFiles === "number" ? numFiles : 0}
        </div>
      </div>
    </div>
  );
};

export default RecordCard;
