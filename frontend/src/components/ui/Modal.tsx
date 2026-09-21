"use client";

import {
  ReactNode,
  useEffect,
} from "react";

import {
  AnimatePresence,
  motion,
} from "motion/react";


type ModalProps = {
  open: boolean;

  onClose: () => void;

  eyebrow?: string;

  title: string;

  description?: string;

  children?: ReactNode;
};


export default function Modal({
  open,
  onClose,
  eyebrow,
  title,
  description,
  children,
}: ModalProps) {

  useEffect(() => {
    if (!open) {
      return;
    }


    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key === "Escape"
      ) {
        onClose();
      }
    }


    document.addEventListener(
      "keydown",
      handleKeyDown
    );


    const originalOverflow =
      document.body.style.overflow;


    document.body.style.overflow =
      "hidden";


    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        originalOverflow;
    };

  }, [
    open,
    onClose,
  ]);


  return (
    <AnimatePresence>

      {open && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            p-4
            sm:p-6
          "
        >

          {/* BACKDROP */}

          <motion.button
            type="button"
            aria-label="Close modal"
            onClick={onClose}

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            exit={{
              opacity: 0,
            }}

            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}

            className="
              absolute
              inset-0
              cursor-default
              bg-[#020409]/75
              backdrop-blur-md
            "
          />


          {/* MODAL */}

          <motion.div
            role="dialog"
            aria-modal="true"

            initial={{
              opacity: 0,
              y: 8,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            exit={{
              opacity: 0,
              y: 5,
            }}

            transition={{
              duration: 0.22,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}

            className="
              ad-surface-raised
              relative
              z-10
              max-h-[85vh]
              w-full
              max-w-xl
              overflow-hidden
            "
          >

            {/* TOP LIGHT */}

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-[-120px]
                h-[220px]
                w-[420px]
                -translate-x-1/2
                rounded-full
                bg-blue-500/[0.09]
                blur-[80px]
              "
            />


            {/* HEADER */}

            <div
              className="
                relative
                border-b
                border-white/[0.055]
                px-6
                py-6
                sm:px-7
              "
            >

              <button
                type="button"
                onClick={onClose}

                className="
                  absolute
                  right-5
                  top-5
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/[0.07]
                  bg-white/[0.02]
                  text-lg
                  text-zinc-500
                  transition-colors
                  duration-150
                  hover:border-white/[0.12]
                  hover:bg-white/[0.04]
                  hover:text-white
                "
              >
                ×
              </button>


              {eyebrow && (
                <p className="ad-eyebrow">
                  {eyebrow}
                </p>
              )}


              <h2
                className="
                  ad-title-md
                  mt-2
                  max-w-[90%]
                "
              >
                {title}
              </h2>


              {description && (
                <p
                  className="
                    ad-body
                    mt-3
                    max-w-lg
                  "
                >
                  {description}
                </p>
              )}

            </div>


            {/* CONTENT */}

            {children && (
              <div
                className="
                  relative
                  max-h-[60vh]
                  overflow-y-auto
                  px-6
                  py-6
                  sm:px-7
                "
              >
                {children}
              </div>
            )}

          </motion.div>

        </div>
      )}

    </AnimatePresence>
  );
}