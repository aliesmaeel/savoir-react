import { useMemo } from "react";

type Icons = {
  [key: string]: string;
};

const UseNavIcons = (): Icons => {
  const icons = useMemo(() => {
    const files = import.meta.glob("/public/images/nav/*.{svg,png,jpg,jpeg}");

    const importedIcons: Icons = {};

    for (const path in files) {
      const iconName = path
        .replace("/public/images/nav/", "") // Remove folder path
        .replace(/\.(svg|png|jpg|jpeg)$/, ""); // Remove file extension

      const publicPath = path.replace("/public", ""); // ✅ Adjust for runtime
      importedIcons[iconName] = publicPath;
    }

    return importedIcons;
  }, []);

  return icons;
};

export default UseNavIcons;
