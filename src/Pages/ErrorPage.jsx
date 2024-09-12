import { PageLayout, PageHeader, Avatar, Text } from "@primer/react";
import { useLocation } from "react-router-dom";

const ErrorComponent = () => {
  const location = useLocation();
  const errorMessage =
    location.state?.errorMessage || "An unexpected error occurred";

  const regex = /status:\s*(\d+)/;
  const match = errorMessage.match(regex);
  const statusCode = match ? match[1] : "";

  let errorBody;
  switch (statusCode) {
    case "403":
      errorBody = "API 訪問次數超過上限";
      break;
    case "404":
      errorBody = "找不到資源";
      break;
    case "401":
      errorBody = "缺少有效驗證憑證";
      break;
    default:
      errorBody = "An unexpected error occurred";
  }

  return (
    <PageLayout>
      <PageLayout.Header>
        <PageHeader>
          <PageHeader.TitleArea sx={{ alignItems: "center" }}>
            <Avatar
              size={28}
              alt="user name"
              src="https://avatars.githubusercontent.com/u/92997159?v=4"
            />
            <PageHeader.Title as="h1" sx={{ fontSize: 36 }}>
              {statusCode} ERROR &nbsp;
            </PageHeader.Title>
          </PageHeader.TitleArea>

          <PageHeader.Description
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text color="fg.muted" sx={{ fontSize: 16 }}>
              {errorBody}
            </Text>
          </PageHeader.Description>
        </PageHeader>
      </PageLayout.Header>
    </PageLayout>
  );
};

export default ErrorComponent;
