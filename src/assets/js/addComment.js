import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const deleteCommentServer = async (comment) => {
  const videoId = window.location.href.split("/video/")[1];
  await axios({
    url: `/api/${videoId}/delete`,
    method: "POST",
    data: { comment },
  });
};

const handleDeleteBtn = (event) => {
  const {
    target: {
      parentNode: {
        firstElementChild: { innerHTML: comment },
      },
    },
    target: { parentNode },
  } = event;
  commentList.removeChild(parentNode);
  deleteCommentServer(comment);
};

const addComment = (comment) => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.innerHTML = comment;
  li.appendChild(span);
  commentList.prepend(li);
  increaseNumber();
};

const sendComment = async (comment) => {
  const videoId = window.location.href.split("/video/")[1];

  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: { comment },
  });
  if (response.status === 200) addComment(comment);
};

const handleSubmit = (event) => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  console.log(comment);
  sendComment(comment);
  commentInput.value = "";
};

const init = () => {
  addCommentForm.addEventListener("submit", handleSubmit);
  if (commentList) {
    const li = commentList.querySelectorAll("li");
    li.forEach((li) => {
      const button = li.querySelector("button");
      button.addEventListener("click", handleDeleteBtn);
    });
  }
};
if (addCommentForm) init();
