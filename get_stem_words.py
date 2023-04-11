import sys
from nltk.stem import PorterStemmer

stemmer = PorterStemmer()

def get_stem_words(words, ignore_words):
    stem_words=[]
    for word in words:
        if word not in ignore_words:
            w = stemmer.stem(word.lower())
            stem_words.append(w)
    return stem_words

sys.modules[__name__] = get_stem_words
