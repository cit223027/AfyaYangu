import ArticleComponent from "@/components/article/ArticleComponent.tsx";
import SpeakPage from "@/components/speech/SpeakPage.tsx";

export default function KnowledgeInsuranceNhifPage() {

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