import re


# Pattern against which new SVG attribute values are matched
class AttributePattern:

    def get_params(self, text):
        pass

    def format(self, params):
        pass


# Numeric attribute pattern
class SimpleAttributePattern(AttributePattern):
    PARAM = r"[+-]?[0-9]+(\.[0-9]+)?|#[0-9a-fA-F]{6}"
    regex = r""
    value = ""

    def __init__(self, text):
        self.value = re.sub(self.PARAM, "*", text)
        self.regex = re.compile(re.sub(r"\*", lambda m : "([^,; ]+)",
                                self.value.replace("(","\\(").replace(")","\\)")))

    # Rebuild the attribute value from interpolated values
    def format(self, params):
        it = iter(params)
        return re.sub(r"\*", lambda m: str(it.__next__()), self.value)

    # Extract the numeric parameters for interpolation
    def get_params(self, text):
        m = re.match(self.regex, text)
        if not m:
            raise Exception("Pattern not matched: " + self.value + " in " + text)
        return [float(p) for p in list(m.groups())]

    def does_match(self, text):
        return re.match(self.regex, text)

    def __repr__(self):
        return "[" + self.value + "]"
