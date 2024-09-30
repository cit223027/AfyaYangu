from fastapi import APIRouter
from api.models.PromptRequestModel import PromptRequestModel
from api.models.PromptResponseModel import PromptResponseModel
from services.openai.AfyaYanguOpenAIAssistant import AfyaYanguOpenAIAssistant
from services.openai.ChatGptHelper import ChatGptHelper

ai_router = APIRouter(prefix = "/ai", tags = ["Engine"])

@ai_router.get("/health")
def greater():
    return { "message": "The ai engine is healthy!" }

@ai_router.post("/base_completion", response_model=PromptResponseModel)
def handle_base_prompt(request: PromptRequestModel) -> PromptResponseModel:
    # print("Called handle_prompt")
    response = ChatGptHelper.send_base_model_request(request.conversation)

    return response

@ai_router.post("/assistant_prompt", response_model=PromptResponseModel)
def handle_prompt(request: PromptRequestModel) -> PromptResponseModel:
    response = AfyaYanguOpenAIAssistant.create_afya_yangu_assistant_request(request)

    print("AIRouter: assistant_prompt", response)
    return PromptResponseModel(
        language = "english",
        message = response
    )



@ai_router.get("/image_prompt", response_model=PromptRequestModel)
def handle_prompt_image(request: PromptRequestModel):
    pass
