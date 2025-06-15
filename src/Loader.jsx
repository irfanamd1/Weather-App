const Loader = () => {
  return (
    <div className="mx-auto text-center space-y-3 mt-10">
        <div className="w-20 h-20 mx-auto animate-pulse bg-[#414345] rounded"></div>

        <div className="h-8 w-40 mx-auto animate-pulse bg-[#414345] rounded"></div>

        <div className="h-10 w-20 mx-auto animate-pulse bg-[#414345] rounded"></div>

        <div className="h-5 w-24 mx-auto animate-pulse bg-[#414345] rounded"></div>

        <div className="h-6 w-28 mx-auto animate-pulse bg-[#414345] rounded"></div>

        <div className="flex justify-around mt-6">
            <div className="mt-2">
            <div className="h-10 w-20 animate-pulse bg-[#414345] rounded"></div>
            </div>
            <div className="mt-2">
            <div className="h-10 w-20 animate-pulse bg-[#414345] rounded"></div>
            </div>
        </div>
        </div>
  );
};

export default Loader;
