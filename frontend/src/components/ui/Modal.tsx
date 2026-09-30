"use client";

import {
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

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
  const [
    mounted,
    setMounted,
  ] = useState(false);


  const dialogRef =
    useRef<HTMLDivElement | null>(
      null
    );


  const closeButtonRef =
    useRef<HTMLButtonElement | null>(
      null
    );


  const titleId =
    useId();


  const descriptionId =
    useId();


  useEffect(() => {
    setMounted(
      true
    );
  }, []);


  useEffect(() => {
    if (
      !open
    ) {
      return;
    }


    const previousActiveElement =
      document.activeElement instanceof
      HTMLElement
        ? document.activeElement
        : null;


    const originalOverflow =
      document.body.style.overflow;


    const originalPaddingRight =
      document.body.style.paddingRight;


    /*
     * Prevent the page behind the modal from scrolling.
     * We also compensate for the scrollbar on desktop so
     * the interface does not jump horizontally.
     */
    const scrollbarWidth =
      window.innerWidth -
      document.documentElement.clientWidth;


    document.body.style.overflow =
      "hidden";


    if (
      scrollbarWidth >
      0
    ) {
      document.body.style.paddingRight =
        `${scrollbarWidth}px`;
    }


    requestAnimationFrame(
      () => {
        closeButtonRef.current?.focus();
      }
    );


    function handleKeyDown(
      event:
        KeyboardEvent
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        event.preventDefault();

        onClose();

        return;
      }


      /*
       * Basic focus trap.
       * Keeps keyboard focus inside the modal.
       */
      if (
        event.key !==
        "Tab"
      ) {
        return;
      }


      const dialog =
        dialogRef.current;


      if (
        !dialog
      ) {
        return;
      }


      const focusableElements =
        Array.from(
          dialog.querySelectorAll<HTMLElement>(
            [
              "button:not([disabled])",
              "a[href]",
              "input:not([disabled])",
              "select:not([disabled])",
              "textarea:not([disabled])",
              '[tabindex]:not([tabindex="-1"])',
            ].join(",")
          )
        ).filter(
          (
            element
          ) =>
            !element.hasAttribute(
              "aria-hidden"
            )
        );


      if (
        focusableElements.length ===
        0
      ) {
        event.preventDefault();

        dialog.focus();

        return;
      }


      const firstElement =
        focusableElements[0];


      const lastElement =
        focusableElements[
          focusableElements.length -
            1
        ];


      if (
        event.shiftKey &&
        document.activeElement ===
          firstElement
      ) {
        event.preventDefault();

        lastElement.focus();

        return;
      }


      if (
        !event.shiftKey &&
        document.activeElement ===
          lastElement
      ) {
        event.preventDefault();

        firstElement.focus();
      }
    }


    document.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );


      document.body.style.overflow =
        originalOverflow;


      document.body.style.paddingRight =
        originalPaddingRight;


      previousActiveElement?.focus();
    };

  }, [
    open,
    onClose,
  ]);


  if (
    !mounted
  ) {
    return null;
  }


  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            px-3

            sm:px-6
          "
          style={{
            paddingTop:
              "max(12px, env(safe-area-inset-top))",

            paddingBottom:
              "max(12px, env(safe-area-inset-bottom))",
          }}
        >
          {/* BACKDROP */}

          <motion.div
            aria-hidden="true"

            onMouseDown={
              onClose
            }

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
              duration:
                0.18,

              ease:
                "easeOut",
            }}

            className="
              absolute
              inset-0
              bg-[#020409]/80
              backdrop-blur-md
            "
          />


          {/* DIALOG */}

          <motion.div
            ref={
              dialogRef
            }

            role="dialog"

            aria-modal="true"

            aria-labelledby={
              titleId
            }

            aria-describedby={
              description
                ? descriptionId
                : undefined
            }

            tabIndex={
              -1
            }

            initial={{
              opacity: 0,

              scale:
                0.985,

              y:
                10,
            }}

            animate={{
              opacity: 1,

              scale:
                1,

              y:
                0,
            }}

            exit={{
              opacity: 0,

              scale:
                0.99,

              y:
                6,
            }}

            transition={{
              duration:
                0.2,

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

              flex
              w-full
              max-w-xl
              flex-col

              overflow-hidden

              rounded-[20px]

              border
              border-white/[0.07]

              bg-[#080d18]

              shadow-[0_30px_100px_rgba(0,0,0,0.55)]

              max-h-[calc(100dvh-24px)]

              sm:max-h-[85dvh]
              sm:rounded-[24px]
            "
          >
            {/* TOP LIGHT */}

            <div
              className="
                pointer-events-none

                absolute
                left-1/2
                top-[-115px]

                h-[210px]
                w-[360px]

                -translate-x-1/2

                rounded-full

                bg-blue-500/[0.09]

                blur-[80px]

                sm:w-[420px]
              "
            />


            {/* HEADER */}

            <div
              className="
                relative
                shrink-0

                border-b
                border-white/[0.055]

                px-4
                py-4

                sm:px-7
                sm:py-6
              "
            >
              <button
                ref={
                  closeButtonRef
                }

                type="button"

                onClick={
                  onClose
                }

                aria-label="Close modal"

                className="
                  absolute
                  right-3
                  top-3

                  flex
                  h-10
                  w-10
                  items-center
                  justify-center

                  rounded-[11px]

                  border
                  border-white/[0.07]

                  bg-white/[0.025]

                  text-[20px]
                  leading-none
                  text-zinc-500

                  transition-colors
                  duration-150

                  hover:border-white/[0.12]
                  hover:bg-white/[0.05]
                  hover:text-white

                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-400/40

                  sm:right-5
                  sm:top-5
                "
              >
                ×
              </button>


              {eyebrow && (
                <p
                  className="
                    pr-12

                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-blue-300/65

                    sm:text-[10px]
                  "
                >
                  {
                    eyebrow
                  }
                </p>
              )}


              <h2
                id={
                  titleId
                }

                className="
                  mt-1.5
                  max-w-[calc(100%-48px)]

                  text-[19px]
                  font-semibold
                  leading-[1.15]
                  tracking-[-0.035em]
                  text-white

                  sm:mt-2
                  sm:text-[24px]
                "
              >
                {
                  title
                }
              </h2>


              {description && (
                <p
                  id={
                    descriptionId
                  }

                  className="
                    mt-2

                    max-w-lg

                    pr-1

                    text-[11px]
                    leading-[1.55]
                    text-zinc-500

                    sm:mt-3
                    sm:text-[14px]
                    sm:leading-6
                  "
                >
                  {
                    description
                  }
                </p>
              )}
            </div>


            {/* CONTENT */}

            {children && (
              <div
                className="
                  relative

                  min-h-0
                  flex-1

                  overscroll-contain

                  overflow-y-auto

                  px-4
                  py-4

                  [scrollbar-width:thin]

                  sm:px-7
                  sm:py-6
                "
              >
                {
                  children
                }
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,

    document.body
  );
}