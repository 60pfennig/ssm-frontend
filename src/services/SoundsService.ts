import { Result } from "ts-results";
import { apiCall, getApiCall } from "@/lib/apiCall";
import { Sound } from "@/types/domain/types";
import qs from "qs";

const BASE_URI = process.env.NEXT_PUBLIC_CMS_BASE_URI;
class SoundsService {
  private constructor(readonly baseUri: string) {}
  static create(baseUri: string | undefined) {
    if (!baseUri) throw new Error("BaseUri is undefined");
    return new SoundsService(baseUri);
  }
  getSoundsOfWorkshop(workshopName: string): Promise<Result<Sound[], string>> {
    throw new Error("Not implmented");
  }
  async getAllSounds(): Promise<Result<Sound[], string>> {
    const query = qs.stringify(
      { limit: 9999 },
      {
        addQueryPrefix: true,
      }
    );
    return getApiCall({
      path: this.baseUri + "/api/sounds" + query,
      map: (data) => data.docs,
    });
  }
}

export const SoundServiceInstance = SoundsService.create(BASE_URI);
