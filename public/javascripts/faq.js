// Get the question, answer and arrow elements
const q = document.querySelectorAll('.q');
const a = document.querySelectorAll('.a');
const arr = document.querySelectorAll('.arrow');


for (let i = 0; i < q.length; i++) {

    // Add click event to all 'q' elements
    q[i].addEventListener('click', () => {
        a[i].classList.toggle('a-opened');
        arr[i].classList.toggle('arrow-rotated');
    });

}
