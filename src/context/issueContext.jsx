// import { createContext, useState, useContext } from "react";

// // 創建 Context
// const IssueContext = createContext();

// // Context 提供者
// export const IssueProvider = ({ children }) => {
//   const [selectedIssue, setSelectedIssue] = useState({ title: "", body: "" });

//   return (
//     <IssueContext.Provider value={{ selectedIssue, setSelectedIssue }}>
//       {children}
//     </IssueContext.Provider>
//   );
// };

// // 自定義 hook 來使用 IssueContext
// export const useIssue = () => {
//   return useContext(IssueContext);
// };
