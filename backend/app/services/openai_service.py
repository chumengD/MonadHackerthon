"""
OpenAI Service - GPT-4 & DALL-E Integration
Handles AI-powered puzzle and image generation
"""

import os
from typing import Optional
from openai import AsyncOpenAI


class OpenAIService:
    """Service for interacting with OpenAI APIs"""
    
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = "gpt-4"
        self.image_model = "dall-e-3"
    
    async def generate_puzzle(
        self,
        keywords: list[str],
        difficulty: str = "medium",
        language: str = "zh"
    ) -> dict:
        """
        Generate a treasure hunt puzzle using GPT-4
        
        Args:
            keywords: List of keywords to inspire the puzzle
            difficulty: Puzzle difficulty (easy, medium, hard)
            language: Output language (zh or en)
        
        Returns:
            Dictionary containing story, question, answer, and hints
        """
        difficulty_descriptions = {
            "easy": "简单，答案比较直观" if language == "zh" else "easy, the answer is straightforward",
            "medium": "中等难度，需要一些思考" if language == "zh" else "medium difficulty, requires some thinking",
            "hard": "困难，需要仔细分析多个线索" if language == "zh" else "hard, requires careful analysis of multiple clues"
        }
        
        lang_instruction = "请用中文回复" if language == "zh" else "Please respond in English"
        
        prompt = f"""
        {lang_instruction}
        
        你是一个创意谜题设计师，需要根据以下关键词创建一个藏宝图谜题：
        关键词：{', '.join(keywords)}
        难度：{difficulty_descriptions.get(difficulty, difficulty_descriptions['medium'])}
        
        请生成以下内容（以JSON格式）：
        1. story: 一个引人入胜的背景故事（100-200字）
        2. question: 需要解答的谜题问题
        3. answer: 谜题的正确答案（简短明确，1-5个字）
        4. hints: 3个由易到难的提示
        
        回复格式：
        {{
            "story": "故事内容...",
            "question": "谜题问题...",
            "answer": "答案",
            "hints": ["提示1", "提示2", "提示3"]
        }}
        
        只返回JSON，不要其他文字。
        """
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "你是一个专业的谜题设计师，擅长创造有趣且有深度的解谜内容。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=1000
        )
        
        import json
        content = response.choices[0].message.content
        
        # Parse JSON response
        try:
            result = json.loads(content)
        except json.JSONDecodeError:
            # Try to extract JSON from the response
            import re
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
            else:
                raise ValueError("Failed to parse AI response as JSON")
        
        return result
    
    async def generate_image(
        self,
        description: str,
        style: str = "treasure map"
    ) -> str:
        """
        Generate a treasure map image using DALL-E
        
        Args:
            description: Description of the scene/story
            style: Art style for the image
        
        Returns:
            URL of the generated image
        """
        prompt = f"""
        Create a {style} style illustration:
        {description}
        
        Style: Vintage treasure map aesthetic, aged paper texture, 
        mysterious symbols, compass rose, decorative borders.
        Make it look like an ancient, hand-drawn treasure map.
        """
        
        response = await self.client.images.generate(
            model=self.image_model,
            prompt=prompt[:4000],  # DALL-E prompt limit
            size="1024x1024",
            quality="standard",
            n=1
        )
        
        return response.data[0].url
    
    async def validate_answer(
        self,
        question: str,
        user_answer: str,
        correct_answer: str
    ) -> dict:
        """
        Use AI to validate if the user's answer is semantically correct
        
        Args:
            question: The puzzle question
            user_answer: User's submitted answer
            correct_answer: The expected correct answer
        
        Returns:
            Dictionary with validation result and explanation
        """
        prompt = f"""
        判断用户答案是否与正确答案语义相同：
        
        问题：{question}
        正确答案：{correct_answer}
        用户答案：{user_answer}
        
        只需回复JSON格式：
        {{
            "is_correct": true/false,
            "explanation": "解释原因"
        }}
        """
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0,
            max_tokens=200
        )
        
        import json
        content = response.choices[0].message.content
        
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            return {
                "is_correct": user_answer.lower().strip() == correct_answer.lower().strip(),
                "explanation": "直接字符串比较"
            }
