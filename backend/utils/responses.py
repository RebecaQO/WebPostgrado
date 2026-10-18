from flask import jsonify

def success_response(data=None, message="Operación exitosa", status_code=200, **kwargs):
    payload = {"success": True, "message": message}
    if data is not None:
        payload["data"] = data
    payload.update(kwargs)
    return jsonify(payload), status_code

def error_response(message="Ocurrió un error", error=None, status_code=400, **kwargs):
    payload = {"success": False, "error": message}
    if error is not None:
        payload["message"] = str(error)
    payload.update(kwargs)
    return jsonify(payload), status_code
