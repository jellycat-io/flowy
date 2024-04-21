'use client';

import { Or } from '@prisma/client/runtime/library';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';
import { toast } from 'sonner';

import { getUserOrgs } from '@/actions/org/get-user-orgs';
import { setActiveOrgAction } from '@/actions/org/set-active-org';
import { Org } from '@/data/org';
import { useAction } from '@/hooks/use-action';
import { useActiveUser } from '@/hooks/use-active-user';
import { useFetch } from '@/hooks/use-fetch';

interface OrgContextProps {
  activeOrg?: Org;
  setActiveOrg: (orgId: string) => void;
  orgs: Org[];
  refreshOrgs: () => void;
  isLoading: boolean;
}

const OrgsContext = React.createContext<OrgContextProps>({
  activeOrg: undefined,
  setActiveOrg: () => {},
  orgs: [],
  refreshOrgs: () => {},
  isLoading: false,
});

interface OrgsProviderProps {
  children: React.ReactNode;
}

export function OrgsProvider({ children }: OrgsProviderProps) {
  const session = useSession();
  const router = useRouter();

  const [currentOrg, setCurrentOrg] = React.useState<Org | undefined>(
    undefined,
  );
  const [orgs, setOrgs] = React.useState<Org[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    data: userOrgs,
    loading: loadingOrgs,
    refresh: refreshOrgs,
  } = useFetch(getUserOrgs, {
    userId: session.data?.user?.id,
  });

  const { execute: setActiveOrg } = useAction(setActiveOrgAction, {
    onError: (error) => {
      toast.error(error);
    },
    onSuccess: async (org) => {
      toast.success(`Switched to ${org.name}`);
      await session.update({
        ...session,
        user: {
          ...session.data?.user,
          activeOrgId: org.id,
        },
      });
      setCurrentOrg(org);
      router.push(`/org/${org.id}`);
    },
  });

  function onSetActiveOrg(orgId: string) {
    setActiveOrg({ orgId });
  }

  React.useEffect(() => {
    setIsLoading(loadingOrgs);

    if (userOrgs) {
      setOrgs(userOrgs);

      const activeOrg = userOrgs.find(
        (org) => org.id === session.data?.user.activeOrgId,
      );
      if (activeOrg) {
        setCurrentOrg(activeOrg);
      }
    }
  }, [userOrgs, session, loadingOrgs]);

  return (
    <OrgsContext.Provider
      value={{
        activeOrg: currentOrg,
        setActiveOrg: onSetActiveOrg,
        orgs,
        refreshOrgs,
        isLoading,
      }}
    >
      {children}
    </OrgsContext.Provider>
  );
}

export function useOrgs() {
  return React.useContext(OrgsContext);
}
