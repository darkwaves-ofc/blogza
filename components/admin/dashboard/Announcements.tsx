const Announcements = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold dark:text-white">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-lamaSkyLight dark:bg-lamaSky/20 rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium dark:text-white">Lorem ipsum dolor sit</h2>
            <span className="text-xs text-gray-400 bg-white dark:bg-gray-700 rounded-md px-1 py-1">
              2025-01-01
            </span>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-300 mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
            expedita. Rerum, quidem facilis?
          </p>
        </div>
        <div className="bg-lamaPurpleLight dark:bg-lamaPurple/20 rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium dark:text-white">Lorem ipsum dolor sit</h2>
            <span className="text-xs text-gray-400 bg-white dark:bg-gray-700 rounded-md px-1 py-1">
              2025-01-01
            </span>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-300 mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
            expedita. Rerum, quidem facilis?
          </p>
        </div>
        <div className="bg-lamaYellowLight dark:bg-lamaYellow/20 rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium dark:text-white">Lorem ipsum dolor sit</h2>
            <span className="text-xs text-gray-400 bg-white dark:bg-gray-700 rounded-md px-1 py-1">
              2025-01-01
            </span>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-300 mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
            expedita. Rerum, quidem facilis?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Announcements;