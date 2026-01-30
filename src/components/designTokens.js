export const selectStyles = {
  wrapper: "relative w-full",

  input:
    "w-full px-4 py-3 rounded-xl bg-white border border-purple-200 shadow-sm \
     focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer \
     transform-none hover:scale-100 active:scale-100 transition-colors",

  dropdown:
    "absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl \
     border border-gray-200 overflow-hidden transform-none",

  option:
    "px-4 py-3 text-sm cursor-pointer flex justify-between items-center \
     hover:bg-purple-50 transform-none hover:scale-100 active:scale-100",

  optionActive: "bg-purple-100 text-purple-700 font-medium",

  optionMuted: "text-gray-500"
};
