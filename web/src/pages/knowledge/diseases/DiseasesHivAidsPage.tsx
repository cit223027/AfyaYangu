import ArticlePreview from "@/components/article/ArticlePreview.tsx";
import {LanguageTranslations} from "@/utils/LanguageTranslations.ts";
import ArticleComponent from "@/components/article/ArticleComponent.tsx";
import SpeakPage from "@/components/speech/SpeakPage.tsx";

export default function KnowledgeDiseasesHivAidsPage() {

    return (
        <ArticleComponent
            englishComponent={<EnglishArticle />}
        />
    )
}

function EnglishArticle() {
    return (
        <SpeakPage>
            <div>

            </div>
        </SpeakPage>
    )
}