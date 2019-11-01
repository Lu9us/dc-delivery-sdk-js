import { ContentClientConfig } from '../../ContentClientConfig';
import {AxiosInstance, AxiosPromise} from 'axios';

export class GetCdv2ContentItem {
  constructor(
    private readonly config: ContentClientConfig,
    private readonly contentClient: AxiosInstance,
  ) {}

  /**
   * Incoming request to get by content ID
   */
  public getByContentId<T = any>(contentId: string, params?: Cdv2RequestParams): AxiosPromise<T> {
    return this.getCdv2ContentItem(contentId, FetchBy.contentId, params);

  }

  /**
   * Incoming request to get by delivery key
   */
  public getByDeliveryKey<T = any>(deliveryKey: string, params: Cdv2RequestParams): AxiosPromise<T> {
    return this.getCdv2ContentItem(deliveryKey, FetchBy.deliveryKey, params);
  }

  /**
   * Content all the items!
   * Deliver all the keys!
   * DELIVER JSON IN UNDER 30MS BECAUSE THAT'S JUST HOW CRAZY WE ARE
   */
  private getCdv2ContentItem<T = any>(contentItem: string, fetchBy: FetchBy, params?: Cdv2RequestParams): AxiosPromise<T> {

    const url = this.buildCdv2Url({
      hubName: this.config.cdv2HubName,
      address: this.config.cdv2BaseUrl,
      contentItem,
      fetchBy,
      depth: params.depth || undefined,
      format: params.format || undefined,
    });

    // Return the submitted request
    return this.contentClient.get(url);

  }

  /**
   * Build the URL to be submitted to the CDv2 endpoint
   */
  private buildCdv2Url(params: Cdv2UrlParams): string {
    let url = '';

    // Add scheme
    url += 'https://';

    // Add hub
    url += params.hubName + '.';

    // Add address
    url += params.address;

    // Add path
    if (params.fetchBy === FetchBy.contentId)
      url += '/content/id/';
    else if (params.fetchBy === FetchBy.deliveryKey)
      url += '/content/key/';

    // Add comntent item
    url += params.contentItem;

    // Add query string
    const args: QueryParam[] = [];
    if (params.depth)
      args.push({key: 'depth', value: params.depth.toString()} );
    if (params.format)
      args.push({key: 'format', value: params.format.toString()} );
    url += this.buildQueryString(args);

    // Return the completed url
    return url;
  }

  /**
   * Build a query string from an array of parameter objects
   */
  private buildQueryString(params: QueryParam[]): string {

    let str = '';

    params.forEach(p => {

      // Add query string character
      if (str.length === 0) {
        str += '?';
      }

      // Add separator
      else {
        str += '&';
      }

      // Add param key
      str += p.key;

      // Optionally add param value if exists
      if (p.value !== undefined)
        str += '=' + p.value;

    });

    return str;
  }
}

class Cdv2RequestParams {
  depth?: Depth;
  format?: Format;
}

class Cdv2UrlParams {
  hubName: string;
  address: string;
  contentItem: string;
  fetchBy: FetchBy;
  depth?: Depth;
  format?: Format;
}

enum Depth {
  root,
  all
}

enum Format {
  linked,
  inlined
}

enum FetchBy {
  contentId,
  deliveryKey
}

class QueryParam {
  key: string;
  value?: string;
}
