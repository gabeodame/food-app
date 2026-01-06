{{- define "food-app.labels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "food-app.imagePullSecrets" -}}
{{- $secrets := list -}}
{{- if .Values.imagePullSecrets }}
{{- $secrets = concat $secrets .Values.imagePullSecrets -}}
{{- end }}
{{- if and .Values.secrets.imagePullSecret.enabled .Values.secrets.imagePullSecret.name }}
{{- $secrets = append $secrets (dict "name" .Values.secrets.imagePullSecret.name) -}}
{{- end }}
{{- if $secrets }}
imagePullSecrets:
{{- toYaml $secrets | nindent 2 }}
{{- end }}
{{- end }}
