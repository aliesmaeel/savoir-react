import { useMemo } from "react";

type Arrows = {
  [key: string]: string;
};

const useArrow = (): Arrows => {
  const arrows = useMemo(() => {
    const files = import.meta.glob("/public/images/arrows/*.{svg,png,jpg,jpeg}");

    const importedArrows: Arrows = {};

    for (const path in files) {
      const arrowName = path
        .replace("/public/images/arrows/", "") // Remove folder path
        .replace(/\.(svg|png|jpg|jpeg)$/, ""); // Remove file extension

      const publicPath = path.replace("/public", ""); // ✅ Adjust for runtime access
      importedArrows[arrowName] = publicPath;
    }

    return importedArrows;
  }, []);

  return arrows;
};

export default useArrow;
