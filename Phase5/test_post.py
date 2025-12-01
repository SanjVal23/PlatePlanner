from post import create_post

tests = [
    {
        "id": 1,
        "data": {
            "image": "pasta.jpeg",
            "description": "Trying out this new recipe!",
            "likeButton": True,
            "likeCount": 5,
            "imageCount": 4
        },
        "expected": "Posted!"
    },
    {
        "id": 2,
        "data": {
            "image": "pasta.jpg",
            "description": "Trying out this new recipe!",
            "likeButton": True,
            "likeCount": 5,
            "imageCount": 7
        },
        "expected": "Too many photos selected"
    },
    {
        "id": 3,
        "data": {
            "image": "pasta.jpg",
            "description": "Trying out this new recipe!",
            "likeButton": True,
            "likeCount": 5,
            "imageCount": 0
        },
        "expected": "No image chosen"
    },
    {
        "id": 4,
        "data": {
            "image": "pasta.jpg",
            "description": "Trying out this new recipe!",
            "likeButton": True,
            "likeCount": 0,
            "imageCount": 4,
            "clicked": True
        },
        "expected": "Like count remains the same"
    },
    {
        "id": 5,
        "data": {
            "image": "pasta.jpg",
            "description": "Trying out this new recipe!",
            "likeButton": True,
            "likeCount": 64,
            "imageCount": 4
        },
        "expected": "Like count is inaccurate"
    },
    {
        "id": 6,
        "data": {
            "image": "pasta.jpg",
            "description": "Trying out this new recipe!",
            "likeButton": False,
            "likeCount": 5,
            "imageCount": 4
        },
        "expected": "Like button does not light when clicked"
    },
    {
        "id": 7,
        "data": {
            "image": "pasta.jpg",
            "description": "Trying out this new recipe!",
            "likeButton": True,
            "likeCount": 5,
            "imageCount": 4,
            "clicked": False
        },
        "expected": "Like button lights up without being clicked"
    },
    {
        "id": 8,
        "data": {
            "image": "pasta.jpg",
            "description":
                "This is my new super cool recipe that I tried out today, it has one thousand six hundred and eighty-four ingredients from every single country in the world!",
            "likeButton": True,
            "likeCount": 5,
            "imageCount": 4
        },
        "expected": "Post is too long"
    },
    {
        "id": 9,
        "data": {
            "image": "pasta.jpg",
            "description": "",
            "likeButton": True,
            "likeCount": 5,
            "imageCount": 4
        },
        "expected": "No post description written"
    },
    {
        "id": 10,
        "data": {
            "image": "pasta.MOV",
            "description": "Trying out this new recipe!",
            "likeButton": True,
            "likeCount": 5,
            "imageCount": 4
        },
        "expected": "Must be an image"
    },
    {
        "id": 11,
        "data": {
            "image": "No image selected",
            "description": "Trying out this new recipe!",
            "likeButton": True,
            "likeCount": 5,
            "imageCount": 4
        },
        "expected": "No image chosen"
    }
]

print("\nRunning test cases:\n")

for t in tests:
    result = create_post(t["data"])
    passed = result["status"] == t["expected"]
    mark = "passed" if passed else "failed"

    print(f"Test {t['id']}: {mark} | Expected: \"{t['expected']}\" | Got: \"{result['status']}\"")

  
    if result["post"] is not None:
        p = result["post"]
        print("Returned Post Object:", {
            "image": p.image,
            "description": p.description,
            "likeButton": p.like_button,
            "likeCount": p.like_count,
            "imageCount": p.image_count
        })
    else:
        print("No post object returned.")

    print("--------------------------------------------------")
