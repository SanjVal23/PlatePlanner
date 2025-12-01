class Post:
    def __init__(self, image, description, like_button, like_count, image_count):
        self.image = image
        self.description = description
        self.like_button = like_button
        self.like_count = like_count
        self.image_count = image_count


def validate_image(image):
    if not image or image == "No image selected":
        return "No image chosen"
    if not image.lower().endswith((".jpg", ".jpeg", ".png", ".gif")):
        return "Must be an image"
    return None


def validate_description(desc):
    if desc == "":
        return "No post description written"
    if len(desc) > 150:
        return "Post is too long"
    return None


def validate_image_count(count):
    if count == 0:
        return "No image chosen"
    if count > 5:
        return "Too many photos selected"
    return None


def validate_like_count(like_count):
    if not isinstance(like_count, (int, float)):
        return "Like count is inaccurate"
    if like_count < 0:
        return "Like count is inaccurate"
    if like_count > 50:
        return "Like count is inaccurate"
    return None


def validate_like_button(like_button, clicked):
    if clicked and not like_button:
        return "Like button does not light when clicked"
    if not clicked and like_button:
        return "Like button lights up without being clicked"
    return None


def validate_like_consistency(like_button, like_count, clicked):
    if clicked and like_button and like_count == 0:
        return "Like count remains the same"
    return None


def create_post(data):
    clicked = data.get("clicked", True)

    msg = validate_image(data["image"])
    if msg: return {"status": msg, "post": None}

    msg = validate_description(data["description"])
    if msg: return {"status": msg, "post": None}

    msg = validate_image_count(data["imageCount"])
    if msg: return {"status": msg, "post": None}

    msg = validate_like_button(data["likeButton"], clicked)
    if msg: return {"status": msg, "post": None}

    msg = validate_like_count(data["likeCount"])
    if msg: return {"status": msg, "post": None}

    msg = validate_like_consistency(data["likeButton"], data["likeCount"], clicked)
    if msg: return {"status": msg, "post": None}

    post = Post(
        data["image"],
        data["description"],
        data["likeButton"],
        data["likeCount"],
        data["imageCount"]
    )

    return {"status": "Posted!", "post": post}
