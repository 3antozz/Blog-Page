import styles from "./Edit.module.css"
import { Editor } from "@tinymce/tinymce-react"
import { useState, useRef } from "react"
import { useOutletContext } from "react-router";
export default function Add () {
    const editorRef = useRef(null);
    const { user, setFetched } = useOutletContext();
    const [titleInput, setTitle] = useState("");
    const [coverURL, setCoverURL] = useState("");
    const [published, setPublished] = useState(false);
    const [success, setSuccess] = useState(false);
    const [updateError, setError] = useState(null);
    const handleTitle = (e) => setTitle(e.target.value);
    const handleCover = (e) => setCoverURL(e.target.value);
    const handlePublished = () => setPublished(!published);

    if(!user) {
        return (
            <div className={styles.loading}>
                <h1>Please Login first</h1>
            </div>
            )
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        const content = editorRef.current.getContent();
        console.log(content);
        try {
            const token = localStorage.getItem("cred");
            const request = await fetch(`http://localhost:3000/posts`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                mode: "cors",
                body: JSON.stringify({
                    title: titleInput,
                    cover_url: coverURL,
                    content,
                })
            })
            const response = await request.json();
            console.log(response);
            if (!request.ok) {
                const error = new Error('Invalid Request');
                error.messages = response.errors || [error.message];
                throw error;
            }
            setError("");
            setSuccess(true);
            setFetched(false);
        } catch(err) {
            setSuccess(false)
            setError(err.messages)
            console.log(err);
        }
    }
      
    return (
        <form onSubmit={handleSubmit} className={styles.postForm}>
            { updateError && updateError.map((error, index) => <li key={index} className={styles.error}>{error}</li>) }
            { success && <li className={styles.success}>Post Added Successfully</li> }
            <div>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" onChange={handleTitle} />
            </div>
            <div>
                <label htmlFor="cover_url">Cover image url</label>
                <input type="text" id="cover_url" onChange={handleCover} />
            </div>
            <div className={styles.publish}>
                <label htmlFor="published">Publish post?</label>
                <input type="checkbox" id="published" onChange={handlePublished} />
                <button>Create Post</button>
            </div>
            <Editor
                apiKey={import.meta.env.VITE_TINY_API_KEY}
                init={{
                    plugins: [
                    // Core editing features
                    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                    // Your account includes a free trial of TinyMCE premium features
                    // Try the most popular premium features until Feb 10, 2025:
                    'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
                    ],
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                    tinycomments_mode: 'embedded',
                    tinycomments_author: 'Author name',
                    mergetags_list: [
                    { value: 'First.Name', title: 'First Name' },
                    { value: 'Email', title: 'Email' },
                    ],
                    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                    skin: 'oxide-dark',
                    content_css: 'dark'
                }}
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue="Post Content"
            />
        </form>
    )
}