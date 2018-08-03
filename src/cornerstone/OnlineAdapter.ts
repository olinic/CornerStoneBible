// Internal dependencies.
import {
   IAdapter,
   IBibleContent,
   IChapterParams,
   ILanguages,
   IVerseParams
} from "../interfaces/IAdapter";
import { ICache } from "../interfaces/ICache";
import { ILogger } from "../interfaces/ILogger";
import {
   IChapterAction,
   ILanguageAction,
   IOnlineAdapterOptions,
   IPostChapterAction,
   IPostLanguageAction,
   IPostVerseAction,
   IVerseAction
} from "../interfaces/IOnlineAdapterOptions";
import { IUrlOptions } from "../interfaces/IUrlOptions";
import { IWebGetter } from "../interfaces/IWebGetter";
import { request } from "../utilities/AdapterUtils";
import { Adapter } from "./Adapter";

export class OnlineAdapter
      extends Adapter implements IAdapter
{
   /**
    * Online Accessor. Retrieves online resources.
    */
   private onlineAccessor: IWebGetter;

   /**
    * Book names used by the adapter.
    */
   private myBooks: string[];

   /**
    * Get the URL for the languages.
    */
   private howToGetLanguages: ILanguageAction;
   /**
    * Language post-processing.
    */
   private howToInterpretLanguages: IPostLanguageAction;
   /**
    * Get the URL for the verse.
    */
   private howToGetVerse: IVerseAction;

   /**
    * Verse post-processing.
    */
   private howToInterpretVerse: IPostVerseAction;

   /**
    * Get the URL for the chapter.
    */
   private howToGetChapter: IChapterAction;

   /**
    * Chapter post-processing.
    */
   private howToInterpretChapter: IPostChapterAction;

   constructor(
         private logger: ILogger,
         private webGetter: IWebGetter,
         adapterOptions: IOnlineAdapterOptions
      )
   {
      super(logger, {
         adapterName: adapterOptions.adapterName,
         maxNumberOfQueries: adapterOptions.maxNumberOfQueries,
         maxVersesInCache: adapterOptions.maxVersesInCache,
         queryPeriod: adapterOptions.queryPeriod,
         termsUrl: adapterOptions.termsUrl,
         textFormat: adapterOptions.textFormat
      });
      this.logger = logger;
      this.onlineAccessor = webGetter;

      this.myBooks = adapterOptions.books;
      this.howToGetLanguages = adapterOptions.howToGetLanguages;
      this.howToInterpretLanguages = adapterOptions.howToInterpretLanguages;
      this.howToGetVerse = adapterOptions.howToGetVerse;
      this.howToInterpretVerse = adapterOptions.howToInterpretVerse;
      this.howToGetChapter = adapterOptions.howToGetChapter;
      this.howToInterpretChapter = adapterOptions.howToInterpretChapter;
   }

   public getVerse(options: IVerseParams): Promise<IBibleContent>
   {
      return request(
         this.howToGetVerse({
            book: this.myBooks[options.book],
            chapter: options.chapter,
            verse: options.verse
         }),
         this.webGetter,
         this.howToInterpretVerse
      );
   }

   public getChapter(options: IChapterParams): Promise<IBibleContent>
   {
      return request(
         this.howToGetChapter({
            book: this.myBooks[options.book],
            chapter: options.chapter
         }),
         this.webGetter,
         this.howToInterpretChapter
      );
   }

   public getLanguages(): Promise<ILanguages>
   {
      return request(
         this.howToGetLanguages(),
         this.webGetter,
         this.howToInterpretLanguages
      );
   }
}
