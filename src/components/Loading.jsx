import loadingGif from "../assets/loading-default.gif";

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "40px",
      }}
    >
      <img src={loadingGif} width="100px" alt="Loading..." />
      <div>載入中...</div>
    </div>
  );
};

export default Loading;
