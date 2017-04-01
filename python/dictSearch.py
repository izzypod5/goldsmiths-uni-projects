def dictSearch(x, dict, default=None):
	if default is None:
		result = dict.get(x)
	else:
		result = dict.get(x, default)
	return result

print(dictSearch("c", {"a" : 1, "b" : 2}, 10))