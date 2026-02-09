// src/app/(dashboard)/investigations/[id]/board/page.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Panel,
  NodeChange,
  ControlButton,
  ReactFlowProvider,
  ReactFlowInstance,
  NodePositionChange,
  MarkerType,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  ArrowLeft,
  Search,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  RefreshCw,
  Layers,
  BarChart3,
  User,
  Building2,
  MapPin,
  Calendar,
  FileText,
  Coins,
  Layout,
  Grid3x3,
  Network as NetworkIcon,
  TrendingUp,
  Link2,
  X,
  Circle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { useBoard } from "@/lib/hooks/useBoard";
import { debounce } from "@/lib/utils";
import { BoardNode } from "@/lib/api/board";

// Entity type configuration
type EntityType =
  | "person"
  | "company"
  | "location"
  | "event"
  | "document"
  | "financial_instrument";

const entityTypeConfig: Record<
  EntityType,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    label: string;
  }
> = {
  person: { icon: User, color: "#6366f1", label: "Person" },
  company: { icon: Building2, color: "#8b5cf6", label: "Company" },
  location: { icon: MapPin, color: "#10b981", label: "Location" },
  event: { icon: Calendar, color: "#f59e0b", label: "Event" },
  document: { icon: FileText, color: "#3b82f6", label: "Document" },
  financial_instrument: { icon: Coins, color: "#14b8a6", label: "Financial" },
};

// Custom node component
interface EntityNodeData {
  label: string;
  entityType: EntityType;
  description: string;
  confidence: number;
  relationships: number;
  sources: number;
  aliases: string[];
  entity: BoardNode;
  color: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
}

const EntityNode = ({ data }: { data: EntityNodeData }) => {
  const Icon = data.icon;
  return (
    <div className="relative p-3 bg-[#111827] border border-[#1f2937] rounded-xl shadow-lg min-w-[180px] hover:shadow-xl transition-all">
      {/* Target Handle (incoming edges) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-[#6b7280] !w-3 !h-3 !border-2 !border-[#111827]"
      />

      <div className="flex items-start gap-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${data.color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: data.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-[#f9fafb] truncate text-sm">
            {data.label}
          </h4>
          <p className="text-xs text-[#6b7280] mt-1 capitalize">
            {data.entityType.replace("_", " ")}
          </p>
        </div>
        <div className="text-xs px-2 py-1 rounded bg-[#1f2937] text-[#9ca3af]">
          {Math.round(data.confidence * 100)}%
        </div>
      </div>
      {data.description && (
        <p className="text-xs text-[#9ca3af] mt-3 line-clamp-2">
          {data.description}
        </p>
      )}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1f2937]">
        <span className="text-xs text-[#6b7280] flex items-center gap-1">
          <Link2 className="w-3 h-3" />
          {data.relationships}
        </span>
        <span className="text-xs text-[#6b7280] flex items-center gap-1">
          <FileText className="w-3 h-3" />
          {data.sources}
        </span>
      </div>

      {/* Source Handle (outgoing edges) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-[#6b7280] !w-3 !h-3 !border-2 !border-[#111827]"
      />
    </div>
  );
};

const nodeTypes = {
  entityNode: EntityNode,
};

type LayoutType = "force" | "grid" | "type";

export default function InvestigationBoardPage() {
  const params = useParams();
  const router = useRouter();
  const investigationId = params.id as string;

  const {
    boardState,
    boardStats,
    isLoading,
    error,
    fetchBoardState,
    fetchBoardStats,
    updateNodePositions,
    clearError,
    reset,
  } = useBoard();
  console.log("boardState::: ", boardState);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesState] = useEdgesState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<EntityType | "all">("all");
  const [showStats, setShowStats] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [layoutType, setLayoutType] = useState<LayoutType>("force");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  // Fetch board data on mount
  useEffect(() => {
    if (investigationId) {
      fetchBoardState(investigationId);
      fetchBoardStats(investigationId);
    }

    // Cleanup on unmount
    return () => {
      reset();
    };
  }, [investigationId]);

  // Transform API data to React Flow format
  useEffect(() => {
    if (boardState) {
      const transformedNodes: Node[] = boardState.nodes.map((node) => ({
        id: node.id,
        type: "entityNode",
        position: node.position,
        data: {
          label: node.name,
          entityType: node.type,
          description: node.description,
          confidence: node.confidence,
          relationships: node.relationships_count,
          sources: node.source_count,
          aliases: node.aliases,
          entity: node,
          color: entityTypeConfig[node.type]?.color || "#6b7280",
          icon: entityTypeConfig[node.type]?.icon || Circle,
        },
      }));

      const transformedEdges: Edge[] = boardState.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: "smoothstep", // or "default", "straight", "step"
        animated: edge.is_active,
        style: {
          stroke: "#9ca3af",
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#9ca3af",
        },
      }));

      setNodes(transformedNodes);
      setEdges(transformedEdges);
    }
  }, [boardState, setNodes, setEdges]);

  // Debounced position update
  const debouncedUpdatePositions = useMemo(
    () =>
      debounce((positions: Array<{ id: string; x: number; y: number }>) => {
        if (investigationId && positions.length > 0) {
          updateNodePositions(investigationId, positions);
        }
      }, 1000),
    [investigationId, updateNodePositions],
  );

  // Handle node position changes
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);

      // Extract position changes and update backend
      const positionChanges = changes
        .filter(
          (change): change is NodePositionChange =>
            change.type === "position" && change.dragging === false,
        )
        .map((change) => ({
          id: change.id,
          x: change.position?.x || 0,
          y: change.position?.y || 0,
        }))
        .filter((pos) => pos.x !== 0 || pos.y !== 0);

      if (positionChanges.length > 0) {
        debouncedUpdatePositions(positionChanges);
      }
    },
    [onNodesChange, debouncedUpdatePositions],
  );

  // Filter nodes based on search and type
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchesSearch = node.data.label
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        filterType === "all" || node.data.entityType === filterType;
      return matchesSearch && matchesType;
    });
  }, [nodes, searchQuery, filterType]);

  // Filter edges to only show connections between visible nodes
  const filteredEdges = useMemo(() => {
    const visibleNodeIds = new Set(filteredNodes.map((n) => n.id));
    return edges.filter(
      (edge) =>
        visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target),
    );
  }, [edges, filteredNodes]);

  // Get selected node data
  const selectedNodeData = useMemo(() => {
    if (!selectedNode) return null;
    return nodes.find((n) => n.id === selectedNode);
  }, [selectedNode, nodes]);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNode(node.id);
    },
    [],
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchBoardState(investigationId);
      await fetchBoardStats(investigationId);
    } catch (err) {
      console.error("Failed to refresh board:", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const applyLayout = (type: LayoutType) => {
    setLayoutType(type);
    const newNodes = [...nodes];
    newNodes.forEach((node, index) => {
      if (type === "grid") {
        node.position = {
          x: 100 + (index % 4) * 300,
          y: 100 + Math.floor(index / 4) * 200,
        };
      } else if (type === "type") {
        const typeIndex = Object.keys(entityTypeConfig).indexOf(
          node.data.entityType,
        );
        node.position = {
          x: 100 + typeIndex * 250,
          y: 100 + (index % 5) * 180,
        };
      } else {
        // Force-directed layout - use a simple random spread
        node.position = {
          x: 100 + Math.random() * 800,
          y: 100 + Math.random() * 500,
        };
      }
    });
    setNodes(newNodes);

    // Save new positions
    const positions = newNodes.map((n) => ({
      id: n.id,
      x: n.position.x,
      y: n.position.y,
    }));
    debouncedUpdatePositions(positions);
  };

  const handleFitView = () => {
    if (rfInstance) {
      rfInstance.fitView();
    }
  };

  const handleZoomIn = () => {
    if (rfInstance) {
      rfInstance.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (rfInstance) {
      rfInstance.zoomOut();
    }
  };

  // Loading state
  if (isLoading && !boardState) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0f1e]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#6366f1] animate-spin mx-auto mb-4" />
          <p className="text-[#6b7280]">Loading investigation board...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !boardState) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0f1e]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-[#f9fafb] mb-2">
            Failed to Load Board
          </h3>
          <p className="text-[#6b7280] mb-6">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href={`/investigations/${investigationId}`}
              className="px-4 py-2 rounded-xl bg-[#1f2937] text-[#f9fafb] hover:bg-[#374151] transition-all"
            >
              Back to Investigation
            </Link>
            <button
              onClick={() => {
                clearError();
                fetchBoardState(investigationId);
              }}
              className="px-4 py-2 rounded-xl bg-[#6366f1] text-white hover:bg-[#5558e3] transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-[#0a0f1e]">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-[#1f2937] bg-[#111827] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/investigations/${investigationId}`}
                className="p-2 rounded-xl bg-[#1f2937] text-[#6b7280] hover:text-[#f9fafb] hover:bg-[#374151] transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold font-mono text-[#f9fafb]">
                  Investigation Board
                </h1>
                <p className="text-sm text-[#6b7280]">
                  {filteredNodes.length} entities • {filteredEdges.length}{" "}
                  relationships
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <input
                  type="text"
                  placeholder="Search entities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 h-10 pl-10 pr-4 rounded-xl bg-[#1f2937] border border-[#374151] text-[#f9fafb] text-sm placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 transition-all"
                />
              </div>

              {/* Layout Options */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#1f2937]">
                <button
                  onClick={() => applyLayout("force")}
                  className={`p-2 rounded-lg transition-all ${
                    layoutType === "force"
                      ? "bg-[#6366f1] text-white"
                      : "text-[#6b7280] hover:text-[#f9fafb]"
                  }`}
                  title="Force-directed layout"
                >
                  <NetworkIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyLayout("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    layoutType === "grid"
                      ? "bg-[#6366f1] text-white"
                      : "text-[#6b7280] hover:text-[#f9fafb]"
                  }`}
                  title="Grid layout"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyLayout("type")}
                  className={`p-2 rounded-lg transition-all ${
                    layoutType === "type"
                      ? "bg-[#6366f1] text-white"
                      : "text-[#6b7280] hover:text-[#f9fafb]"
                  }`}
                  title="Group by type"
                >
                  <Layout className="w-4 h-4" />
                </button>
              </div>

              {/* Actions */}
              <button
                onClick={() => setShowStats(!showStats)}
                className={`p-2.5 rounded-xl transition-all ${
                  showStats
                    ? "bg-[#6366f1] text-white"
                    : "bg-[#1f2937] text-[#6b7280] hover:text-[#f9fafb]"
                }`}
                title="Toggle statistics"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2.5 rounded-xl bg-[#1f2937] text-[#6b7280] hover:text-[#f9fafb] hover:bg-[#374151] transition-all disabled:opacity-50"
                title="Refresh board"
              >
                <RefreshCw
                  className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 mt-4">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-500 font-medium">
                  Failed to Update
                </p>
                <p className="text-sm text-red-400 mt-1">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="p-1 rounded-lg text-red-500 hover:bg-red-500/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filterType === "all"
                  ? "bg-[#6366f1] text-white"
                  : "bg-[#1f2937] text-[#6b7280] hover:text-[#f9fafb]"
              }`}
            >
              All Types
            </button>
            {(Object.keys(entityTypeConfig) as EntityType[]).map((type) => {
              const config = entityTypeConfig[type];
              const Icon = config.icon;
              const count = nodes.filter(
                (n) => n.data.entityType === type,
              ).length;

              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    filterType === type
                      ? "text-white"
                      : "bg-[#1f2937] text-[#6b7280] hover:text-[#f9fafb]"
                  }`}
                  style={
                    filterType === type
                      ? { backgroundColor: config.color }
                      : undefined
                  }
                >
                  <Icon className="w-4 h-4" />
                  {config.label}
                  <span className="opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Board */}
        <div className="flex-1 relative">
          {filteredNodes.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Layers className="w-16 h-16 text-[#6b7280] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#f9fafb] mb-2">
                  No Entities Found
                </h3>
                <p className="text-[#6b7280]">
                  {searchQuery || filterType !== "all"
                    ? "Try adjusting your filters"
                    : "Entities will appear as the investigation progresses"}
                </p>
              </div>
            </div>
          ) : (
            <ReactFlow
              nodes={filteredNodes}
              edges={filteredEdges}
              onNodesChange={handleNodesChange}
              onEdgesChange={onEdgesState}
              onNodeClick={handleNodeClick}
              onPaneClick={handlePaneClick}
              nodeTypes={nodeTypes}
              onInit={setRfInstance}
              connectionMode={ConnectionMode.Loose}
              fitView
              minZoom={0.1}
              maxZoom={2}
              // Add these props:
              elevateEdgesOnSelect={true}
              edgesUpdatable={true}
              edgesFocusable={true}
              defaultEdgeOptions={{
                type: "smoothstep",
                style: { stroke: "#9ca3af", strokeWidth: 2 },
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  color: "#9ca3af",
                },
              }}
            >
              <Background color="#1f2937" gap={16} />
              <Controls
                className="!bg-[#111827] !border-[#1f2937] !rounded-xl !shadow-lg"
                showInteractive={false}
              >
                <ControlButton onClick={handleZoomIn} title="Zoom in">
                  <ZoomIn className="w-4 h-4" />
                </ControlButton>
                <ControlButton onClick={handleZoomOut} title="Zoom out">
                  <ZoomOut className="w-4 h-4" />
                </ControlButton>
                <ControlButton onClick={handleFitView} title="Fit view">
                  <Maximize2 className="w-4 h-4" />
                </ControlButton>
              </Controls>
              <MiniMap
                className="!bg-[#111827] !border-[#1f2937] !rounded-xl !shadow-lg"
                nodeColor={(node) => {
                  const config =
                    entityTypeConfig[node.data.entityType as EntityType];
                  return config?.color || "#6b7280";
                }}
                maskColor="rgb(10, 15, 30, 0.8)"
              />

              {/* Stats Panel */}
              {showStats && boardStats && (
                <Panel
                  position="top-right"
                  className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 shadow-xl"
                  style={{ margin: "10px", minWidth: "200px" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-[#f9fafb]">
                      Statistics
                    </h3>
                    <button
                      onClick={() => setShowStats(false)}
                      className="p-1 rounded-lg text-[#6b7280] hover:text-[#f9fafb] hover:bg-[#1f2937] transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-8">
                      <span className="text-[#6b7280]">Entities</span>
                      <span className="text-[#f9fafb] font-medium">
                        {boardStats.total_entities}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-8">
                      <span className="text-[#6b7280]">Relationships</span>
                      <span className="text-[#f9fafb] font-medium">
                        {boardStats.total_relationships}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-8">
                      <span className="text-[#6b7280]">Evidence</span>
                      <span className="text-[#f9fafb] font-medium">
                        {boardStats.total_evidence}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-8">
                      <span className="text-[#6b7280]">Avg. Confidence</span>
                      <span className="text-[#f9fafb] font-medium">
                        {(boardStats.average_confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </Panel>
              )}

              {/* Legend */}
              {showLegend && (
                <Panel
                  position="bottom-left"
                  className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 shadow-xl"
                  style={{ margin: "10px", minWidth: "200px" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-[#f9fafb]">
                      Entity Types
                    </h3>
                    <button
                      onClick={() => setShowLegend(false)}
                      className="p-1 rounded-lg text-[#6b7280] hover:text-[#f9fafb] hover:bg-[#1f2937] transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(Object.keys(entityTypeConfig) as EntityType[]).map(
                      (type) => {
                        const config = entityTypeConfig[type];
                        const Icon = config.icon;

                        return (
                          <div
                            key={type}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div
                              className="w-6 h-6 rounded-md flex items-center justify-center"
                              style={{ backgroundColor: `${config.color}20` }}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[#9ca3af]">
                              {config.label}
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </Panel>
              )}

              {/* Selected Entity Panel */}
              {selectedNodeData && (
                <Panel
                  position="top-left"
                  className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 shadow-xl"
                  style={{
                    margin: "10px",
                    minWidth: "300px",
                    maxWidth: "400px",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: `${selectedNodeData.data.color}20`,
                        }}
                      >
                        {(() => {
                          const config =
                            entityTypeConfig[
                              selectedNodeData.data.entityType as EntityType
                            ];
                          const Icon = config?.icon || Circle;
                          return (
                            <div style={{ color: config?.color || "#6b7280" }}>
                              <Icon className="w-5 h-5" />
                            </div>
                          );
                        })()}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#f9fafb]">
                          {selectedNodeData.data.label}
                        </h3>
                        <p className="text-xs text-[#6b7280] capitalize">
                          {selectedNodeData.data.entityType.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="p-1 rounded-lg text-[#6b7280] hover:text-[#f9fafb] hover:bg-[#1f2937] transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedNodeData.data.description && (
                      <div>
                        <p className="text-xs text-[#6b7280] mb-1">
                          Description
                        </p>
                        <p className="text-sm text-[#d1d5db]">
                          {selectedNodeData.data.description}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-[#6b7280] mb-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Confidence
                        </p>
                        <p className="text-sm text-[#f9fafb] font-medium">
                          {(selectedNodeData.data.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6b7280] mb-1 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          Sources
                        </p>
                        <p className="text-sm text-[#f9fafb] font-medium">
                          {selectedNodeData.data.sources}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-[#6b7280] mb-1 flex items-center gap-1">
                        <Link2 className="w-3 h-3" />
                        Relationships
                      </p>
                      <p className="text-sm text-[#f9fafb] font-medium">
                        {selectedNodeData.data.relationships}
                      </p>
                    </div>

                    {selectedNodeData.data.aliases &&
                      selectedNodeData.data.aliases.length > 0 && (
                        <div>
                          <p className="text-xs text-[#6b7280] mb-2">Aliases</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedNodeData.data.aliases.map(
                              (alias: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 rounded-lg bg-[#1f2937] text-xs text-[#9ca3af]"
                                >
                                  {alias}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </Panel>
              )}
            </ReactFlow>
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
}
