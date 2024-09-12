import styled from "styled-components";
import { ActionList, Box, Header, Checkbox, Button } from "@primer/react";

export const IssueHeader = styled(Header)`
  border: 1px solid;
  border-bottom: 0;
  border-radius: 0.375rem 0.375rem 0 0; // 應該有個官方規範叫做 borderRadius-medium
  border-color: #dee3e8; /* TODO: 使用官方文件的顏色 */
  height: 55px;
  background-color: #f6f8fa;
  margin: 0;
`;

export const IssueCheckbox = styled(Checkbox)`
  width: 13px;
  height: 13px;
  margin-left: 0;
  margin-right: 8px;
`;

export const IssueOpenClosedButton = styled(Button)`
  color: #636c76;
  background-color: #f6f8fa;
  border: 0;
  padding: 6px;
  margin-right: 10px;
  box-shadow: none;
`;

export const IssueCardContainer = styled(ActionList.Item)`
  border: 1px solid;
  border-radius: 0.375rem; // 應該有個官方規範叫做 borderRadius-medium
  border-color: #dee3e8; /* TODO: 使用官方文件的顏色 */
  cursor: default;
  margin: 0;
  border-radius: 0;
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;
  max-width: 1214px;
  box-sizing: border-box;

  &:hover {
    background-color: #f6f8fa;
  }
`;

export const IssueAllContainer = styled(Box)`
  /* border: 1px solid #dee3e8; */
  width: 100%;
  max-width: 1214px; // TODO: 查找官方文件
  border-radius: 0.375rem; // 應該有個官方規範叫做 borderRadius-medium
  margin: auto;
`;
