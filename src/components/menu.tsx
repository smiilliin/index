import React, { useCallback, useEffect, useRef, useState } from "react";

interface IMenu {
  uuid: string;
  element: JSX.Element;
  close: () => void;
}
interface IEMenuPosition {
  target: React.RefObject<HTMLElement>;
  children: JSX.Element;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}
const MenuPosition = ({
  target,
  children,
  left,
  right,
  top,
  bottom,
}: IEMenuPosition) => {
  const thisRef = useRef<HTMLDivElement>(null);

  const getTargetRect = useCallback(() => {
    let currentRect = target.current?.getBoundingClientRect();
    const thisRect = thisRef.current?.getBoundingClientRect();

    if (currentRect && thisRect) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let newLeft = currentRect.left + (left || 0) - (right || 0);
      let newRight =
        currentRect.left + thisRect.width - (left || 0) + (right || 0);
      let newTop = currentRect.top + (top || 0) - (bottom || 0);
      let newBottom =
        currentRect.bottom + thisRect.height + (top || 0) - (bottom || 0);

      if (newRight > windowWidth) {
        newLeft = windowWidth - thisRect.width;
        newRight = windowWidth;
      }
      if (newBottom > windowHeight) {
        newTop = windowHeight - thisRect.height;
        newBottom = windowHeight;
      }

      currentRect = {
        ...currentRect,
        left: newLeft,
        right: newRight,
        top: newTop,
        bottom: newBottom,
      };
    }
    return currentRect;
  }, [target, left, right, top, bottom]);
  const [rect, setRect] = useState<DOMRect | undefined>(getTargetRect());

  useEffect(() => {
    const eventListener = () => {
      setRect(getTargetRect());
    };
    window.addEventListener("resize", eventListener);
    return () => {
      window.removeEventListener("resize", eventListener);
    };
  }, [target, getTargetRect]);
  useEffect(() => {
    setRect(getTargetRect());
  }, [getTargetRect]);

  return (
    <div
      ref={thisRef}
      style={{
        top: rect?.top || 0,
        left: rect?.left || 0,
        width: "auto",
        height: "auto",
        position: "fixed",
      }}
    >
      {children}
    </div>
  );
};
class MenuManager {
  menus: IMenu[];
  setMenus: React.Dispatch<React.SetStateAction<IMenu[]>>;
  called: boolean;

  constructor(
    menus: IMenu[],
    setMenus: React.Dispatch<React.SetStateAction<IMenu[]>>
  ) {
    this.menus = menus;
    this.setMenus = setMenus;
    this.called = false;
  }

  getIndex(uuid: string) {
    return this.menus.findIndex((v) => v.uuid == uuid);
  }
  addMenu(element: JSX.Element, uuid: string, close: () => void) {
    if (this.getIndex(uuid) != -1) throw new Error("Duplicated menu uuid");

    this.menus.push({ element: element, uuid: uuid, close: close });
    this.setMenus([...this.menus]);
  }
  delete(uuid: string, close?: boolean) {
    const index = this.getIndex(uuid);

    if (index != -1) {
      if (close) this.menus[index].close();
      this.menus.splice(index, 1);

      this.setMenus([...this.menus]);
    }
  }
  getMenus() {
    return this.menus;
  }
  render(): JSX.Element[] {
    return this.menus.map((v) => (
      <React.Fragment key={v.uuid}>{v.element}</React.Fragment>
    ));
  }
  closeAllMenu() {
    this.menus.forEach((v) => v.close());
    this.menus = [];
    this.setMenus([...this.menus]);
  }
}

export type { IMenu };
export { MenuPosition, MenuManager };
