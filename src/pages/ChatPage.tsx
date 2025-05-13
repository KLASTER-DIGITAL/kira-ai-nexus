
import React from "react";
import Layout from "@/components/layout/Layout";
import ChatInterface from "@/components/chat/ChatInterface";

const ChatPage: React.FC = () => {
  return (
    <Layout title="Чат">
      <div className="max-w-4xl mx-auto h-[calc(100vh-180px)]">
        <ChatInterface />
      </div>
    </Layout>
  );
};

export default ChatPage;
