type SectionHeaderProps = {
  eyebrow?: string;

  title: string;

  description?: string;

  action?: React.ReactNode;
};


export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: SectionHeaderProps) {

  return (
    <div
      className="
        flex
        flex-col
        gap-5
        sm:flex-row
        sm:items-end
        sm:justify-between
      "
    >

      <div>

        {eyebrow && (
          <p className="ad-eyebrow">
            {eyebrow}
          </p>
        )}


        <h2
          className="
            ad-title-md
            mt-2
          "
        >
          {title}
        </h2>


        {description && (
          <p
            className="
              ad-body
              mt-2
              max-w-2xl
            "
          >
            {description}
          </p>
        )}

      </div>


      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}

    </div>
  );
}