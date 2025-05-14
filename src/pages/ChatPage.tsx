
import React from "react";
import Layout from "@/components/layout/Layout";
import ChatInterface from "@/components/chat/ChatInterface";

const ChatPage: React.FC = () => {
  return (
    <Layout title="Чат">
      <div className="h-[calc(100vh-80px)] flex flex-col">
        <ChatInterface />
      </div>
    </Layout>
  );
};

export default ChatPage;
