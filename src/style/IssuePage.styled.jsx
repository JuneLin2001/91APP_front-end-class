import styled from "styled-components";
import {
  ActionList,
  Box,
  // Text,
  // RelativeTime,
  Header,
  Checkbox,
  // CheckboxGroup,
  // IconButton,
  //   SegmentedControl,
  Button,
  // ButtonGroup,
} from "@primer/react";

export const IssueHeader = styled(Header)`
  height: 55px;
  background-color: #f6f8fa;
  margin: 0;
  padding: 16px;
`;

export const IssueCheckbox = styled(Checkbox)`
  width: 13px;
  height: 13px;
  margin-left: 0;
  margin-right: 8px;
`;

export const IssueLabelBox = styled.span`
  display: inline-block;
  background-color: ${({ bg }) => bg || "#f0f0f0"};
  color: ${({ color }) => color || "black"};
  border-radius: 100px;
  margin-left: 4px;
  padding: 0px 7px;
  font-size: 12px;
  font-weight: bold;
  border: ${({ border }) => border || "0"};
  border-color: ${({ borderColor }) => borderColor || "transparent"};
  position: relative;

  &:hover::after {
    content: attr(aria-label);
    position: absolute;
    left: 50%;
    bottom: 100%;
    transform: translateX(-50%);
    background-color: black;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    white-space: nowrap;
    opacity: 0.75;
    pointer-events: none;
  }
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
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-color: #dee3e8; /* TODO: 使用官方文件的顏色 */
  cursor: default;
  margin: 0;
  border-radius: 0;
  padding-left: 16px; /* px: 3 相當於 padding-left: 16px */
  padding-right: 16px;
  width: 100%;
  max-width: 1214px;
  box-sizing: border-box;

  &:hover {
    background-color: #f6f8fa;
  }
`;

export const IssueAllContainer = styled(Box)`
  border: 1px solid #dee3e8;
  width: 100%;
  max-width: 1214px; // TODO: 查找官方文件
  border-radius: 0.375rem; // 應該有個官方規範叫做 borderRadius-medium
  margin: auto;
`;
