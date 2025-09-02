import { useMemo } from "react";

type Icons = {
  [key: string]: string;
};

const useIcons = (): Icons => {
  const icons = useMemo(() => {
    const files = import.meta.glob("/public/images/icons/*.{svg,png,jpg,jpeg,webp}");

    const importedIcons: Icons = {};

    for (const path in files) {
      const iconName = path
        .replace("/public/images/icons/", "") // Remove full public path
        .replace(/\.(svg|png|jpg|jpeg|webp)$/, ""); // Remove file extension

      const publicPath = path.replace("/public", ""); // ✅ Convert to runtime-accessible path
      importedIcons[iconName] = publicPath;
    }

    return importedIcons;
  }, []);

  return icons;
};

export default useIcons;
