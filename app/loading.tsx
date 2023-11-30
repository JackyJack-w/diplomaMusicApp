export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
    <div className=" h-full w-full bg-black relative">
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className="pyramid-loader">
        <div className="wrapper">
          <span className="side side1"></span>
          <span className="side side2"></span>
          <span className="side side3"></span>
          <span className="side side4"></span>
          <span className="shadow"></span>
        </div>
      </div>
      </div>
      
    </div>
    )
  }