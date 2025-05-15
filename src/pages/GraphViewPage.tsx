
import React from "react";
import Layout from "@/components/layout/Layout";
import GraphView from "@/components/graph/GraphView";

const GraphViewPage: React.FC = () => {
  return (
    <Layout title="Граф связей">
      <div className="container mx-auto">
        <GraphView />
      </div>
    </Layout>
  );
};

export default GraphViewPage;
