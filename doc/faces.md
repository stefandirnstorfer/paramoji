
* Introduction

The description of an emotional state is an important part of human communication. 
Emotions are often difficult to capture in a well-defined and objective terminology or even on numeric scales.
The only widely established technique is to use facial expressions for human emotion 
These can be subjectively and intuitively understood by everyone. 
However, there is a lack of consensus on how to process such faces computationally.
So far, any system of facial expressions, such as the emoji, has either limited objective interpretability or stayed very limited in its expressive range.

Emoji are the most widely used system of facial expressions as they are now integrated in electronic devices and part of the unicode standard.
The extreme range of available expressions make them difficult to interpret.
Some emoji seem to be on a scale of increasing intensity, while others seem to be exact negations of each other. However, no clear consensus exists. Some emoji are even interpreted inconsistently accoss cultures



Another system of facial expressions is the Wong-Baker FACES® Pain Rating Scale.
This system is absolutely clear in its interpretation.
The faces have a clear order, can be compared with each other and turned into statistics.
This feature make them a very powerful tool in pain therapy, as they satisfy the needs of experts and laymen alike.
However, the scale is only one-dimensional and the range of emotional states is limited to a single aspect of the perceivable space.


Maybe the earliest system of facial visualizations are the Chernoff faces.
These have a very clear numerical interpretation, as each movable part of a human face is controlled by a numeric value.
However, these faces lack an emotional interpretation. It would for example be difficult to define which faciescan be considered to perceive more pain. As such Chernoff faces could be shown to convey no additional information, when compared to other visualization techniques.


This paper suggests a facial visualization that includes 5 measurable aspects of a human emotion.
It contributes a simple parameterised depiction of a human face that spans a large range of human emotions.
The author claims this technique to have no other purpose  



* Model dimensions

The circumflex model

Potential

Contempt

Expression

# The visualization

The graphics of the presented facial expression is defined in SVG and Javascript computer language that can be understood by any modern web browser.

The coordinates and angles all derive linearly from input parameters defined above.

Hence, every coordinate of the face is defined by up to 6 numbers defining the default position and a displacement that is proportional to the input parameters.

This simplicity allows for a rational interpretation of the face, as each emotional dimension has a clear and independent geometric effect. Yet, the emotional state conveyed by each of the faces creates surprising new qualities as those features are combined.

Basis images


# Conclusion

There are many applications where emotional states need to be captured, processed or displayed. 

Smaller emotional scope than emoji, as there exist some emojis for very particular emotions that do not fit in a dimensional model.
The facial expression has fewer dimensions than Chernoff faces which contain dimensions for, eg. size of ears that cannot be varied by people at will.
The dimensions of the presented face are inspired by scientific models, but do they do lack the depth and psychological justification of the eg. the Wong-Baker scale.
However, it is a middle ground between alternative systems. 
Thus, it fills a gap that is left open by existing methods.


# References

[WongBaker]
https://en.wikipedia.org/wiki/Wong%E2%80%93Baker_Faces_Pain_Rating_Scale

[DVPRS]
https://academic.oup.com/painmedicine/article/16/11/2152/2460410

[Chernoff]
https://de.wikipedia.org/wiki/Chernoff-Gesichter

Chernoff’s original 1973 paper, "The Use of Faces to Represent Points in K-Dimensional Space Graphically"

[Circumplex]
https://content.apa.org/record/1981-25062-001

[Potency]
Scherer, Klaus & Dan-Glauser, Elise & Flykt, Anders. (2006). What determines a feeling's position in affective space? A case for appraisal. Cognition and Emotion. 20. 92-113. 10.1080/02699930500305016.

Ertel, S. (1964). Die emotionale Natur des ``semantischen'' Raumes. [The emotional nature of
``semantic'' space]. Psychologische Forschung, 28, 1-32.

[Contempt]
https://www.paulekman.com/universal-emotions/what-is-contempt/

https://www.frontiersin.org/articles/10.3389/fpsyg.2019.02221/full
https://www.frontiersin.org/articles/10.3389/fpsyg.2016.02061/full
