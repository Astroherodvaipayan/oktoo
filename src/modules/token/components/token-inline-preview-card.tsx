const TokenInlinePreviewCard = ({
  percent,
  title,
  symbol,
  img,
  totalInUsd,
  onClick,
}: {
  img: string;
  percent: number;
  title: string;
  symbol: string;
  totalInUsd: string;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={() => {
        onClick();
      }}
      className="w-full rounded-xl hover:bg-accent cursor-pointer flex flex-row gap-2 px-4 py-4"
    >
      <div className="">
        <img src={img} className="rounded-full w-5 h-5 pt-0.5" />
      </div>
      <div className="flex-1">
        <div className="w-full space-between flex flex-row">
          <div className="flex-1 text-sm">
            {title} ({symbol || ''})
          </div>
          <div className="flex row gap-2">
            <div className="w-[100px] md:w-[300px] h-5 bg-zinc-800 rounded-xl overflow-hidden">
              <div className="h-5 rounded-full" style={{ width: `${percent}%`, backgroundColor: 'green' }}></div>
            </div>
            <div className={`text-sm ${percent < 1 ? 'ml-2' : ''}`}>{percent.toFixed(1)}%</div>
          </div>
        </div>
        <div className="text-zinc-400">${totalInUsd} USD</div>
      </div>
    </div>
  );
};

export default TokenInlinePreviewCard;
