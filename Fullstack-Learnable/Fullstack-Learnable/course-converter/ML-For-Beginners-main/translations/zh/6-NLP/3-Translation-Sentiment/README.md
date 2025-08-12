# 机器学习中的翻译和情感分析

在前面的课程中，你学习了如何使用`TextBlob`构建一个基本的机器人，这是一个在幕后嵌入了机器学习的库，用于执行基本的自然语言处理任务，如名词短语提取。在计算语言学中，另一个重要的挑战是准确地将一个语言的句子翻译成另一种语言。

## [课前测验](https://gray-sand-07a10f403.1.azurestaticapps.net/quiz/35/)

翻译是一个非常困难的问题，因为有成千上万种语言，每种语言都有非常不同的语法规则。一种方法是将一种语言的正式语法规则（如英语）转换为一种不依赖语言的结构，然后通过转换回另一种语言来进行翻译。这种方法的步骤如下：

1. **识别**。将输入语言中的单词标记为名词、动词等。
2. **创建翻译**。生成目标语言格式的每个单词的直接翻译。

### 示例句子，从英语到爱尔兰语

在“英语”中，句子 _I feel happy_ 是三个单词，顺序是：

- **主语** (I)
- **动词** (feel)
- **形容词** (happy)

然而，在“爱尔兰语”中，同一句子有非常不同的语法结构——情感如“*happy*”或“*sad*”被表达为在你身上。

英语短语`I feel happy`在爱尔兰语中是`Tá athas orm`。一个*字面*翻译是`Happy is upon me`。

一个将爱尔兰语翻译成英语的人会说`I feel happy`，而不是`Happy is upon me`，因为他们理解句子的意思，即使单词和句子结构不同。

爱尔兰语句子的正式顺序是：

- **动词** (Tá 或 is)
- **形容词** (athas, 或 happy)
- **主语** (orm, 或 upon me)

## 翻译

一个简单的翻译程序可能只翻译单词，而忽略句子结构。

✅ 如果你作为成年人学习了第二（或第三或更多）语言，你可能会开始时用母语思考，在脑海中逐字翻译概念到第二语言，然后说出你的翻译。这类似于简单的翻译计算机程序所做的。要达到流利程度，重要的是要超越这个阶段！

简单的翻译会导致糟糕（有时甚至搞笑）的误译：`I feel happy`字面翻译成爱尔兰语是`Mise bhraitheann athas`。这意味着（字面上）`me feel happy`，并不是一个有效的爱尔兰语句子。尽管英语和爱尔兰语是两个紧邻岛屿上使用的语言，它们却有着非常不同的语法结构。

> 你可以观看一些关于爱尔兰语言传统的视频，如[这个](https://www.youtube.com/watch?v=mRIaLSdRMMs)

### 机器学习方法

到目前为止，你已经了解了自然语言处理的正式规则方法。另一种方法是忽略单词的含义，而是_使用机器学习来检测模式_。如果你有大量的文本（一个*语料库*）或文本（*语料库*）在原始语言和目标语言中，这种方法可以在翻译中起作用。

例如，考虑*傲慢与偏见*的情况，这是简·奥斯汀在1813年写的一本著名的英语小说。如果你查阅这本书的英文版和人类翻译的*法文*版，你可以在其中检测到一种语言中成语式翻译成另一种语言的短语。你很快就会这样做。

例如，当一个英语短语如`I have no money`被字面翻译成法语时，它可能变成`Je n'ai pas de monnaie`。“Monnaie”是一个棘手的法语“假同源词”，因为“money”和“monnaie”并不相同。一个更好的翻译是人类可能会做的`Je n'ai pas d'argent`，因为它更好地传达了你没有钱的意思（而不是“零钱”，这是“monnaie”的意思）。

![monnaie](../../../../translated_images/monnaie.606c5fa8369d5c3b3031ef0713e2069485c87985dd475cd9056bdf4c76c1f4b8.zh.png)

> 图片由 [Jen Looper](https://twitter.com/jenlooper) 提供

如果一个机器学习模型有足够的人类翻译来建立一个模型，它可以通过识别先前由两种语言的专家人类翻译的文本中的常见模式来提高翻译的准确性。

### 练习 - 翻译

你可以使用`TextBlob`来翻译句子。试试**傲慢与偏见**的著名第一句话：

```python
from textblob import TextBlob

blob = TextBlob(
    "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife!"
)
print(blob.translate(to="fr"))

```

`TextBlob`的翻译非常好：“C'est une vérité universellement reconnue, qu'un homme célibataire en possession d'une bonne fortune doit avoir besoin d'une femme!”。

可以说，TextBlob的翻译实际上比1932年V. Leconte和Ch. Pressoir的法语翻译更准确：

"C'est une vérité universelle qu'un célibataire pourvu d'une belle fortune doit avoir envie de se marier, et, si peu que l'on sache de son sentiment à cet égard, lorsqu'il arrive dans une nouvelle résidence, cette idée est si bien fixée dans l'esprit de ses voisins qu'ils le considèrent sur-le-champ comme la propriété légitime de l'une ou l'autre de leurs filles."

在这种情况下，由机器学习提供的信息的翻译比人为翻译做得更好，后者不必要地为“清晰”而在原作者的嘴里塞了话。

> 这里发生了什么？为什么TextBlob在翻译方面如此出色？实际上，它使用了Google翻译，这是一个复杂的AI，能够解析数百万的短语，以预测最适合手头任务的字符串。这里没有任何手动操作，你需要互联网连接来使用`blob.translate`.

✅ Try some more sentences. Which is better, ML or human translation? In which cases?

## Sentiment analysis

Another area where machine learning can work very well is sentiment analysis. A non-ML approach to sentiment is to identify words and phrases which are 'positive' and 'negative'. Then, given a new piece of text, calculate the total value of the positive, negative and neutral words to identify the overall sentiment. 

This approach is easily tricked as you may have seen in the Marvin task - the sentence `Great, that was a wonderful waste of time, I'm glad we are lost on this dark road`是一个讽刺的、负面的情感句子，但简单的算法检测到“great”、“wonderful”、“glad”是正面的，“waste”、“lost”和“dark”是负面的。总体情感被这些相互冲突的单词所左右。

✅ 停下来想一想我们作为人类如何表达讽刺。语调起了很大的作用。尝试用不同的方式说“好吧，那部电影真棒”，看看你的声音如何传达意义。

### 机器学习方法

机器学习的方法是手动收集负面和正面的文本——推文或电影评论，或者任何人们给出评分和书面意见的内容。然后可以将自然语言处理技术应用于意见和评分，以便出现模式（例如，正面的电影评论往往比负面的电影评论更多地使用“奥斯卡级别”的短语，或正面的餐馆评论更多地说“美食”而不是“恶心”）。

> ⚖️ **示例**：如果你在政治家的办公室工作，有一项新的法律正在辩论中，选民可能会写信给办公室，支持或反对这项新法律。假设你负责阅读这些邮件并将它们分类为支持和反对。如果有很多邮件，你可能会感到不堪重负，试图阅读所有的邮件。如果有一个机器人可以为你阅读所有邮件，理解它们并告诉你每封邮件属于哪一类，那不是很好吗？
> 
> 一种实现方法是使用机器学习。你会用一部分反对的邮件和一部分支持的邮件来训练模型。模型会倾向于将某些短语和单词与反对方和支持方相关联，但它不会理解任何内容，只是某些单词和模式更有可能出现在反对或支持的邮件中。你可以用一些没有用于训练模型的邮件来测试它，看看它是否得出了与你相同的结论。然后，一旦你对模型的准确性感到满意，你就可以处理未来的邮件，而不必阅读每一封邮件。

✅ 这个过程听起来像你在前面的课程中使用的过程吗？

## 练习 - 情感句子

情感通过一个从-1到1的*极性*来衡量，-1是最负面的情感，1是最正面的情感。情感还通过0到1的评分来衡量客观性（0）和主观性（1）。

再看看简·奥斯汀的*傲慢与偏见*。该文本可在[古腾堡计划](https://www.gutenberg.org/files/1342/1342-h/1342-h.htm)上找到。下面的示例显示了一个短程序，它分析了书中的第一句和最后一句的情感，并显示其情感极性和主观性/客观性评分。

你应该使用`TextBlob`库（如上所述）来确定`情感`（你不必编写自己的情感计算器）在以下任务中。

```python
from textblob import TextBlob

quote1 = """It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife."""

quote2 = """Darcy, as well as Elizabeth, really loved them; and they were both ever sensible of the warmest gratitude towards the persons who, by bringing her into Derbyshire, had been the means of uniting them."""

sentiment1 = TextBlob(quote1).sentiment
sentiment2 = TextBlob(quote2).sentiment

print(quote1 + " has a sentiment of " + str(sentiment1))
print(quote2 + " has a sentiment of " + str(sentiment2))
```

你会看到以下输出：

```output
It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want # of a wife. has a sentiment of Sentiment(polarity=0.20952380952380953, subjectivity=0.27142857142857146)

Darcy, as well as Elizabeth, really loved them; and they were
     both ever sensible of the warmest gratitude towards the persons
      who, by bringing her into Derbyshire, had been the means of
      uniting them. has a sentiment of Sentiment(polarity=0.7, subjectivity=0.8)
```

## 挑战 - 检查情感极性

你的任务是通过情感极性来确定*傲慢与偏见*是否有更多绝对正面的句子而不是绝对负面的句子。对于这个任务，你可以假设极性评分为1或-1是绝对正面或负面。

**步骤：**

1. 从古腾堡计划下载一本[傲慢与偏见](https://www.gutenberg.org/files/1342/1342-h/1342-h.htm)的副本作为.txt文件。删除文件开头和结尾的元数据，只保留原文。
2. 在Python中打开文件并将内容提取为字符串。
3. 使用书字符串创建一个TextBlob。
4. 在循环中分析书中的每个句子。
   1. 如果极性是1或-1，将句子存储在正面或负面的消息数组或列表中。
5. 最后，分别打印出所有正面句子和负面句子及其数量。

这里有一个示例[解决方案](https://github.com/microsoft/ML-For-Beginners/blob/main/6-NLP/3-Translation-Sentiment/solution/notebook.ipynb)。

✅ 知识检查

1. 情感是基于句子中使用的单词，但代码*理解*单词吗？
2. 你认为情感极性准确吗？换句话说，你*同意*这些评分吗？
   1. 特别是，你是否同意以下句子的绝对**正面**极性？
      * “What an excellent father you have, girls!” said she, when the door was shut.
      * “Your examination of Mr. Darcy is over, I presume,” said Miss Bingley; “and pray what is the result?” “I am perfectly convinced by it that Mr. Darcy has no defect.
      * How wonderfully these sort of things occur!
      * I have the greatest dislike in the world to that sort of thing.
      * Charlotte is an excellent manager, I dare say.
      * “This is delightful indeed!
      * I am so happy!
      * Your idea of the ponies is delightful.
   2. 以下三个句子被评分为绝对正面情感，但仔细阅读，它们并不是正面的句子。为什么情感分析认为它们是正面的句子？
      * Happy shall I be, when his stay at Netherfield is over!” “I wish I could say anything to comfort you,” replied Elizabeth; “but it is wholly out of my power.
      * If I could but see you as happy!
      * Our distress, my dear Lizzy, is very great.
   3. 你是否同意以下句子的绝对**负面**极性？
      - Everybody is disgusted with his pride.
      - “I should like to know how he behaves among strangers.” “You shall hear then—but prepare yourself for something very dreadful.
      - The pause was to Elizabeth’s feelings dreadful.
      - It would be dreadful!

✅ 任何简·奥斯汀的爱好者都会理解，她经常用她的书来批评英国摄政时期社会中更荒谬的方面。伊丽莎白·班内特，《傲慢与偏见》的主角，是一个敏锐的社会观察者（像作者一样），她的语言经常充满了微妙的意味。即使是故事中的爱情对象达西先生也注意到伊丽莎白的戏谑和戏弄的语言使用：“我已经有幸与你相识足够长的时间，知道你偶尔会表达一些并非你真正观点的意见，以此为乐。”

---

## 🚀挑战

你能通过从用户输入中提取其他特征来让Marvin变得更好吗？

## [课后测验](https://gray-sand-07a10f403.1.azurestaticapps.net/quiz/36/)

## 复习与自学

有很多方法可以从文本中提取情感。想想可能利用这种技术的商业应用。想想它可能会出错的地方。阅读更多关于分析情感的复杂企业级系统，如[Azure文本分析](https://docs.microsoft.com/azure/cognitive-services/Text-Analytics/how-tos/text-analytics-how-to-sentiment-analysis?tabs=version-3-1?WT.mc_id=academic-77952-leestott)。测试一些上述的傲慢与偏见的句子，看看它是否能检测到微妙之处。

## 作业

[诗意许可](assignment.md)

**免责声明**：
本文件使用基于机器的人工智能翻译服务进行翻译。虽然我们努力确保准确性，但请注意，自动翻译可能包含错误或不准确之处。应将原始语言的文件视为权威来源。对于关键信息，建议使用专业人工翻译。我们对因使用本翻译而产生的任何误解或误读不承担责任。