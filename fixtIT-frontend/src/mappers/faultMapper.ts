import type { FaultWithUserObject } from "@fixit/shared/src/types/fault";
import type { IUserBase } from "@fixit/shared/src/types/user";

export function mapFaultFromApi(raw: any): FaultWithUserObject {
  return {
    ...raw,
    id: raw.id ?? raw._id,
    reportedBy: raw.reportedBy && {
      ...raw.reportedBy,
      id: raw.reportedBy.id ?? raw.reportedBy._id,
    },
  };
}

export function mapUserFromApi(raw: any): IUserBase {
  return {
    ...raw,
    id: raw.id ?? raw._id
  };
}