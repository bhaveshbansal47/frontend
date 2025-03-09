"use client";

import { getProjects, getTables, getUsers } from "@/api/supabase";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface Project {
  id: string;
  name: string;
  organizationId: string;
  pitrEnabled: boolean;
}

interface User {
  username: string;
  email: string;
  mfaEnabled: boolean;
}

interface Table {
  name: string;
  projectId: string;
  rlsEnabled: boolean;
}

interface SupabaseState {
  accessToken: string | null;
  projects: {
    status: "loading" | "success" | "error";
    data: Project[];
  };
  users: {
    status: "loading" | "success" | "error";
    data: User[];
  };
  tables: {
    status: "loading" | "success" | "error";
    data: Table[];
  };
  checkCompliance: (accessToken: string) => Promise<void>;
  setAccessToken: (accessToken: string | null) => void;
}

const SupabaseContext = createContext<SupabaseState | undefined>(undefined);

export const SupabaseContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [projects, setProjects] = useState<{
    status: "loading" | "success" | "error";
    data: Project[];
  }>({ status: "loading", data: [] });
  const [users, setUsers] = useState<{
    status: "loading" | "success" | "error";
    data: User[];
  }>({
    status: "loading",
    data: [],
  });
  const [tables, setTables] = useState<{
    status: "loading" | "success" | "error";
    data: Table[];
  }>({
    status: "loading",
    data: [],
  });
  const checkCompliance = useCallback(async (accessToken: string) => {
    setAccessToken(accessToken);
    setProjects({ status: "loading", data: [] });
    setUsers({ status: "loading", data: [] });
    setTables({ status: "loading", data: [] });
    const projects: Project[] = await getProjects(accessToken);
    setProjects({ status: "success", data: projects });

    const organisationIds = Array.from(
      new Set(projects.map((project) => project.organizationId))
    );

    const usersData: User[][] = await Promise.all(
      organisationIds.map((organizationId) =>
        getUsers(accessToken, organizationId)
      )
    );
    const users = usersData
      .flat()
      .filter(
        (user, index, self) =>
          index === self.findIndex((u) => u.email === user.email)
      );
    setUsers({ status: "success", data: users });
    const tablesData: Table[][] = await Promise.all(
      projects.map((project) => getTables(accessToken, project.id))
    );
    const tables = tablesData.flat();
    setTables({ status: "success", data: tables });
  }, []);

  return (
    <SupabaseContext.Provider
      value={{
        accessToken,
        projects,
        users,
        tables,
        checkCompliance,
        setAccessToken
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = (): SupabaseState => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};
