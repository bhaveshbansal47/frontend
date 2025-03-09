"use client";

import { CSSProperties, useState } from "react";
import { useSupabase } from "../supabase-context-provider";
import { AiChatBot } from "../ai-chat-bot";
import { enableRls } from "@/api/supabase";

export function ComplianceCheck() {
  const supabase = useSupabase();
  const [activeTab, setActiveTab] = useState("projects");
  const [helpMessage, setHelpMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const themeColor = "hsl(154.9deg 59.5% 70% / 1)";
  const themeColorDark = "hsl(154.9deg 59.5% 55% / 1)";

  const renderContent = () => {
    if (
      (activeTab === "projects" && supabase.projects.status === "loading") ||
      (activeTab === "users" && supabase.users.status === "loading") ||
      (activeTab === "tables" && supabase.tables.status === "loading")
    ) {
      return (
        <div style={styles.loaderContainer}>
          <span style={{ ...styles.loadingDot, width: 20, height: 20 }}></span>
          <span style={{ ...styles.loadingDot, width: 20, height: 20 }}></span>
          <span style={{ ...styles.loadingDot, width: 20, height: 20 }}></span>
        </div>
      );
    }

    if (
      (activeTab === "projects" &&
        (!supabase.projects.data || supabase.projects.data.length === 0)) ||
      (activeTab === "users" &&
        (!supabase.users.data || supabase.users.data.length === 0)) ||
      (activeTab === "tables" &&
        (!supabase.tables.data || supabase.tables.data.length === 0))
    ) {
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyStateIcon}>📂</div>
          <h3 style={styles.emptyStateTitle}>No data found</h3>
          <p style={styles.emptyStateText}>
            {activeTab === "projects"
              ? "No projects have been created yet."
              : activeTab === "users"
              ? "No users have been added yet."
              : "No tables have been created yet."}
          </p>
        </div>
      );
    }

    if (activeTab === "projects") {
      return (
        <div style={styles.tableContainer}>
          <table style={styles.dataTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Project Name</th>
                <th style={styles.tableHeader}>PITR Enabled</th>
                <th style={styles.tableHeader}>Action</th>
              </tr>
            </thead>
            <tbody>
              {supabase.projects.data.map((project, index) => (
                <tr
                  key={index}
                  style={
                    index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                  }
                >
                  <td style={styles.tableCell}>{project.name}</td>
                  <td style={styles.tableCell}>
                    {project.pitrEnabled ? (
                      <span style={styles.checkIcon}>✓</span>
                    ) : (
                      <span style={styles.crossIcon}>✗</span>
                    )}
                  </td>
                  <td style={styles.tableCell}>
                    {project.pitrEnabled ? (
                      <span style={{ color: "#777" }}>No action required</span>
                    ) : (
                      <button
                        style={{
                          padding: "8px 12px",
                          backgroundColor: themeColorDark,
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          setHelpMessage(
                            `Please help me in enabling PITR for project ${project.name}`
                          )
                        }
                      >
                        Help me
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === "users") {
      return (
        <div style={styles.tableContainer}>
          <table style={styles.dataTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>User Name</th>
                <th style={styles.tableHeader}>MFA Enabled</th>
                <th style={styles.tableHeader}>Action</th>
              </tr>
            </thead>
            <tbody>
              {supabase.users.data.map((user, index) => (
                <tr
                  key={index}
                  style={
                    index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                  }
                >
                  <td style={styles.tableCell}>{user.username}</td>
                  <td style={styles.tableCell}>
                    {user.mfaEnabled ? (
                      <span style={styles.checkIcon}>✓</span>
                    ) : (
                      <span style={styles.crossIcon}>✗</span>
                    )}
                  </td>
                  <td style={styles.tableCell}>
                    {user.mfaEnabled ? (
                      <span style={{ color: "#777" }}>No action required</span>
                    ) : (
                      <button
                        style={{
                          padding: "8px 12px",
                          backgroundColor: themeColorDark,
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          setHelpMessage(
                            `Please help me in enabling MFA for user ${user.username}`
                          )
                        }
                      >
                        Help me
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === "tables") {
      return (
        <div style={styles.tableContainer}>
          <table style={styles.dataTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Table Name</th>
                <th style={styles.tableHeader}>RLS Enabled</th>
                <th style={styles.tableHeader}>Action</th>
              </tr>
            </thead>
            <tbody>
              {supabase.tables.data.map((table, index) => (
                <tr
                  key={index}
                  style={
                    index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                  }
                >
                  <td style={styles.tableCell}>{table.name}</td>
                  <td style={styles.tableCell}>
                    {table.rlsEnabled ? (
                      <span style={styles.checkIcon}>✓</span>
                    ) : (
                      <span style={styles.crossIcon}>✗</span>
                    )}
                  </td>
                  <td style={styles.tableCell}>
                    {table.rlsEnabled ? (
                      <span style={{ color: "#777" }}>No action required</span>
                    ) : (
                      <button
                        style={{
                          padding: "8px 12px",
                          backgroundColor: themeColorDark,
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        disabled={isLoading}
                        onClick={() => {
                          setIsLoading(true);
                          enableRls(
                            supabase.accessToken as string,
                            table.projectId,
                            table.name
                          ).then(() => {
                            supabase
                              .checkCompliance(supabase.accessToken as string)
                              .then(() => {
                                setIsLoading(false);
                              });
                          });
                        }}
                      >
                        Enable RLS
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div style={styles.complianceContainer}>
      <h2 style={styles.header}>Compliance Dashboard</h2>
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "projects" ? styles.activeTab : {}),
            backgroundColor: activeTab === "projects" ? themeColor : "#f5f5f5",
          }}
          onClick={() => setActiveTab("projects")}
          disabled={supabase.projects.status === "loading"}
        >
          <span style={styles.tabIcon}>📁</span>
          <span style={styles.tabText}>
            Projects
            {supabase.projects.status === "loading" && (
              <div style={styles.loadingDotsContainer}>
                <span style={styles.loadingDot}></span>
                <span style={styles.loadingDot}></span>
                <span style={styles.loadingDot}></span>
              </div>
            )}
          </span>
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "users" ? styles.activeTab : {}),
            backgroundColor: activeTab === "users" ? themeColor : "#f5f5f5",
          }}
          onClick={() => setActiveTab("users")}
          disabled={supabase.users.status === "loading"}
        >
          <span style={styles.tabIcon}>👤</span>
          <span style={styles.tabText}>
            Users
            {supabase.users.status === "loading" && (
              <div style={styles.loadingDotsContainer}>
                <span style={styles.loadingDot}></span>
                <span style={styles.loadingDot}></span>
                <span style={styles.loadingDot}></span>
              </div>
            )}
          </span>
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "tables" ? styles.activeTab : {}),
            backgroundColor: activeTab === "tables" ? themeColor : "#f5f5f5",
          }}
          onClick={() => setActiveTab("tables")}
          disabled={supabase.tables.status === "loading"}
        >
          <span style={styles.tabIcon}>🗃️</span>
          <span style={styles.tabText}>
            Tables
            {supabase.tables.status === "loading" && (
              <div style={styles.loadingDotsContainer}>
                <span style={styles.loadingDot}></span>
                <span style={styles.loadingDot}></span>
                <span style={styles.loadingDot}></span>
              </div>
            )}
          </span>
        </button>
      </div>

      <div style={styles.content}>{renderContent()}</div>
      <AiChatBot helpMessage={helpMessage} />
      {isLoading && (
        <div style={styles.fullScreenLoader}>
          <div style={styles.loaderRing}></div>
          <p style={styles.loaderText}>Enabling RLS...</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  fullScreenLoader: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 1000,
  } as CSSProperties,
  loaderText: {
    fontSize: "16px",
    color: "#333",
    marginTop: "16px",
  } as CSSProperties,
  complianceContainer: {
    display: "flex",
    flexDirection: "column",
    padding: "30px",
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  } as CSSProperties,
  header: {
    margin: "0 0 20px 0",
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
  },
  tabs: {
    display: "flex",
    marginBottom: "30px",
    gap: "16px",
    minHeight: "48px",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    cursor: "pointer",
    border: "none",
    borderRadius: "8px",
    color: "#555",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    height: "48px",
    minWidth: "120px",
  } as CSSProperties,
  tabIcon: {
    marginRight: "8px",
    fontSize: "16px",
  },
  tabText: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  } as CSSProperties,
  activeTab: {
    color: "#fff",
    fontWeight: "600",
  },
  loadingDotsContainer: {
    display: "flex",
    marginLeft: "10px",
    alignItems: "center",
    height: "4px",
  },
  loadingDot: {
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    backgroundColor: "currentColor",
    margin: "0 2px",
    opacity: 0.7,
    animation: "fadeInOut 1.4s infinite ease-in-out",
    animationDelay: "0s",
    ":nthChild(2)": {
      animationDelay: "0.2s",
    },
    ":nthChild(3)": {
      animationDelay: "0.4s",
    },
  } as CSSProperties,
  content: {
    width: "100%",
    borderRadius: "8px",
    overflow: "hidden",
    minHeight: "300px",
  },
  tableContainer: {
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    borderRadius: "8px",
    overflow: "hidden",
  },
  dataTable: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "14px",
  } as CSSProperties,
  tableHeader: {
    padding: "16px",
    backgroundColor: "hsl(154.9deg 59.5% 70% / 0.2)",
    color: "#333",
    fontWeight: "600",
    borderBottom: "1px solid #eee",
  },
  tableRowEven: {
    backgroundColor: "#fff",
  },
  tableRowOdd: {
    backgroundColor: "#fafafa",
  },
  tableCell: {
    padding: "14px 16px",
    borderBottom: "1px solid #eee",
  },
  checkIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    backgroundColor: "rgba(39, 174, 96, 0.15)",
    color: "#27AE60",
    fontWeight: "bold",
  },
  crossIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    backgroundColor: "rgba(235, 87, 87, 0.15)",
    color: "#EB5757",
    fontWeight: "bold",
  },
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "300px",
  },
  loaderRing: {
    display: "inline-block",
    width: "40px",
    height: "40px",
    position: "relative",
  } as CSSProperties,

  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    height: "300px",
    textAlign: "center",
  } as CSSProperties,
  emptyStateIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    opacity: "0.5",
  },
  emptyStateTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#555",
    margin: "0 0 8px 0",
  },
  emptyStateText: {
    fontSize: "14px",
    color: "#777",
    maxWidth: "300px",
    margin: 0,
  },
  "@keyframes fadeInOut": {
    "0%, 100%": {
      opacity: 0.3,
    },
    "50%": {
      opacity: 1,
    },
  },
  "@keyframes loaderRingAnimation": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
};
