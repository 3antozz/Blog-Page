import styles from "./Edit.module.css"
import { Editor } from "@tinymce/tinymce-react"
import { useState, useRef, useMemo } from "react"
import { useParams, useOutletContext, Link } from "react-router";
import { LoaderCircle } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;
export default function Edit () {
    const editorRef = useRef(null);
    const { postId } = useParams();
    const { posts, error, user, setFetched } = useOutletContext();
    const post = useMemo(() => {
        return posts.filter((elem) => elem.id == postId)[0]
    },[postId, posts])
    const [titleInput, setTitle] = useState(post ? post.title : "");
    const [coverURL, setCoverURL] = useState(post ? post.cover_url : "");
    const [published, setPublished] = useState(post ? post.published : false);
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
    if (error) {
        return (
            <div className={styles.loading}>
                <h1>{error || "Unexpected Error occured, please try again later."}</h1>
            </div>
        )
    }
    if (posts.length === 0){
        return (
            <div className="loading">
                <LoaderCircle size={60} className="icon"/>
                <p>This may take a while</p>
            </div>
        )
    }
    if (!post) {
        return (
            <div className={styles.exist}>
                <h1>Post doesn&apos;t exist</h1>
                <Link to="/"><h1>Go back</h1></Link>
            </div>
    )
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        const content = editorRef.current.getContent();
        console.log(content);
        try {
            const token = localStorage.getItem("cred");
            const request = await fetch(`${API_URL}/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                mode: "cors",
                body: JSON.stringify({
                    title: titleInput,
                    cover_url: coverURL,
                    content,
                    published
                })
            })
            const response = await request.json();
            console.log(response);
            if (!request.ok) {
                const error = new Error('Invalid Request');
                error.messages = response.errors || [error.message];
                throw error;
            }
            setFetched(false)
            setError("");
            setSuccess(true);
        } catch(err) {
            setSuccess(false)
            setError(err.messages)
            console.log(err);
        }
    }
      
    return (
        <form onSubmit={handleSubmit} className={styles.postForm}>
            { updateError && updateError.map((error, index) => <li key={index} className={styles.error}>{error}</li>) }
            { success && <li className={styles.success}>Post Updated Successfully</li> }
            <div>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" value={titleInput} onChange={handleTitle} />
            </div>
            <div>
                <label htmlFor="cover_url">Cover image url</label>
                <input type="text" id="cover_url" value={coverURL} onChange={handleCover} />
            </div>
            <div className={styles.publish}>
                <label htmlFor="published">Publish post?</label>
                <input type="checkbox" id="published" checked={published} onChange={handlePublished} />
                <button>Update Post</button>
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
                initialValue={post.content}
                
            />
        </form>
    )
}