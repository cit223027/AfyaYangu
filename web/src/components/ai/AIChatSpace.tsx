import {Button} from "@/components/ui/button.tsx";
import {ExitIcon} from "@radix-ui/react-icons";
import {LanguageTranslations} from "@/utils/LanguageTranslations.ts";
import React, {useContext, useState} from "react";
import {AppLanguage, AppLanguageContext} from "@/context/AppLanguageContext.ts";
import {Loader2Icon, MicIcon, SendIcon, SpeechIcon} from "lucide-react";
import {Textarea} from "@/components/ui/textarea.tsx";
import AIConversationMessage, {AIConversationUser} from "@/components/ai/AIConversationMessage.ts";
import BackendApi from "@/components/backend/BackendApi.ts";
import {AIContext} from "@/context/AIContext.ts";
import Markdown from "react-markdown";

type AIChatSpaceProps = {
    className?:string
    onCloseAIChatSpace: () => void;
}

type AILoadingMessage = {
    language: AppLanguage,
    message: string
}

export default function AIChatSpace({
    className,
    onCloseAIChatSpace
}: AIChatSpaceProps) {

    const { appLanguage } = useContext(AppLanguageContext)
    const { pageInformation } = useContext(AIContext)

    const [conversationMessages, setConversationMessages] = useState<AIConversationMessage[]>([])
    const [loadingMessage, setLoadingMessage] = useState<AILoadingMessage | undefined>(undefined)
    const [textPrompt, setTextPrompt] = useState("")
    const [isListening, setIsListening] = useState(false)

    const handleStartListening = async () => {

    }

    const handleStopRecording = () => {

    };

    const handleSubmit = () => {

        const newLoadingMessage: AILoadingMessage = {
            language: appLanguage,
            message: textPrompt
        }

        setLoadingMessage(newLoadingMessage)
        setTextPrompt('')
        setIsListening(false)

        // Make backend call
        BackendApi.makeAIPrompt(
            appLanguage,
            textPrompt,
            conversationMessages,
            pageInformation.convertToPageContext(),
            ""
        ).then((result) => {

            if (result === undefined) {
                // An Error has occurred
                setTextPrompt(newLoadingMessage.message)
                setLoadingMessage(undefined)
            } else {
                const newMessages = conversationMessages

                newMessages.push(AIConversationMessage.createUserMessage(newLoadingMessage.language, newLoadingMessage.message))
                newMessages.push(result)

                setConversationMessages(newMessages)
                setLoadingMessage(undefined)
            }
        })
        
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (textPrompt !== '' && loadingMessage !== undefined) {
                handleSubmit()
            }
        }
    };

    const handleSpeak = (_text: string) => {

    }

    return (
        <div className={`${className} flex flex-col w-full`}>
            <div className="flex flex-row justify-between py-2 my-2 px-2">
                <h4 className="text-lg font-bold">{LanguageTranslations.aiAsk.getTranslation(appLanguage)}</h4>
                <Button variant="ghost" onClick={onCloseAIChatSpace}><ExitIcon /></Button>
            </div>

            <div className="grow w-full overflow-y-auto min-h-0">
                {conversationMessages.map((message, index) => (
                    <ConversationMessageComponent
                        key={index}
                        aiConversationMessage={message}
                        onSpeak={(text) => handleSpeak(text)}
                    />
                ))}
            </div>

            <div className="w-full">
                {loadingMessage && (<ConversationLoadingComponent loadingMessage={loadingMessage}/>)}
            </div>

            <div className="flex flex-row items-center px-2 py-2">
                {/* Input fields */}

                {textPrompt === '' && (
                    <Button
                        variant={isListening ? "destructive" : "default"}
                        onClick={isListening ? handleStartListening : handleStopRecording}
                        className={`transition-all duration-300 ease-in-out ${isListening ? "grow" : "rounded-full"}`}
                    >
                        <MicIcon className="w-4 h-4" />
                        <span className='ms-2'>{LanguageTranslations.speak.getTranslation(appLanguage)}</span>
                    </Button>
                )}

                <Textarea
                    className={`transition-all duration-300 ease-in-out mx-2 ${isListening ? "hidden" : "grow"}`}
                    value={textPrompt}
                    onChange={(e) => setTextPrompt(e.target.value)}
                    placeholder={`${LanguageTranslations.aiAsk.getTranslation(appLanguage)}...`}
                    onKeyDown={handleKeyDown}
                />

                <Button
                    className={`rounded-full`}
                    disabled={isListening || textPrompt === '' || (loadingMessage !== undefined)}
                    onClick={handleSubmit}
                >
                    <SendIcon className="w-4 h-4" />
                    <span className="ms-2">{LanguageTranslations.ask.getTranslation(appLanguage)}</span>
                </Button>
            </div>
        </div>
    )
}

function ConversationLoadingComponent(
    {
        id,
        className,
        loadingMessage
    }: {
        id?: string
        className?: string
        loadingMessage: AILoadingMessage
    }
) {

    return (
        <div id={id} className={`${className} w-full flex flex-row items-center`}>
            <Loader2Icon />
            <div className="p-2 ms-2 rounded-xl bg-gray-900">
                <p>{loadingMessage.message}</p>
            </div>
        </div>
    )
}

function ConversationMessageComponent(
    {
        id,
        className,
        aiConversationMessage,
        onSpeak
    }: {
        id?:string
        className?:string
        aiConversationMessage: AIConversationMessage
        onSpeak: (text: string) => void
    }
) {

    if (aiConversationMessage.user === AIConversationUser.User) {
        return (
            <ConversationMessageUserComponent
                id={id}
                className={className}
                aiConversationMessage={aiConversationMessage}
                onSpeak={onSpeak}
            />
        )
    } else {
        return (
            <ConversationMessageSystemComponent
                id={id}
                className={className}
                aiConversationMessage={aiConversationMessage}
                onSpeak={onSpeak}
            />
        )
    }
}

function ConversationMessageSystemComponent(
    {
        id,
        className,
        aiConversationMessage,
        onSpeak
    }:{
        id?: string
        className?: string
        aiConversationMessage: AIConversationMessage
        onSpeak: (text: string) => void
    }
) {

    const { appLanguage } = useContext(AppLanguageContext)

    return (
        <div id={id} className={`${className} w-full flex flex-row px-2 py-3`}>
            <div className="p-3 rounded-xl mx-2 bg-gray-900 grow min-w-0">
                <div className="flex flex-col space-y-2">
                    <Markdown>{aiConversationMessage.message}</Markdown>
                    <div className="flex flex-row w-full justify-start mt-4">
                        <p>
                            <span className="font-bold text-sm">{LanguageTranslations.language.getTranslation(appLanguage)}: </span>
                            <span className="font-light italic text-sm">{aiConversationMessage.language}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col px-2 py-2">
                <Button variant="ghost" onClick={() => onSpeak(aiConversationMessage.message)}>
                    <SpeechIcon className="h-4 w-4"/>
                </Button>
            </div>
        </div>
    )
}

function ConversationMessageUserComponent(
    {
        id,
        className,
        aiConversationMessage,
        onSpeak
    }:{
        id?: string
        className?: string
        aiConversationMessage: AIConversationMessage
        onSpeak: (text: string) => void
    }
) {

    return (
        <div id={id} className={`${className} w-full flex flex-row-reverse px-2 py-3`}>
            <div className="p-3 rounded-xl mx-2 bg-gray-900 grow min-w-0">
                <div className="flex flex-col space-y-2">
                    <p>{aiConversationMessage.message}</p>
                    <div className="flex flex-row w-full justify-end">
                        <p className="font-light text-sm">{aiConversationMessage.language}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col px-2 py-2">
                <Button variant="ghost" onClick={() => onSpeak(aiConversationMessage.message)}>
                    <SpeechIcon className="h-4 w-4"/>
                </Button>
            </div>
        </div>
    )
}
