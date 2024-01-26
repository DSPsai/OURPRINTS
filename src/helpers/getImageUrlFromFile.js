export default function () {
  let reader = new FileReader()
  reader.readAsDataURL(e.target.files[0])
  reader.onloadend = () => {
    setFilePath(reader.result)
    props.onChange(reader.result)
  }
}