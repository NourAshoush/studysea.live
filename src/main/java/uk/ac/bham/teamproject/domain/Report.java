package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A Report.
 */
@Entity
@Table(name = "report")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Report implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "content_id")
    private String contentID;

    @Column(name = "content_author")
    private String contentAuthor;

    @Column(name = "reported_by")
    private String reportedBy;

    @Column(name = "reported_time")
    private Instant reportedTime;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "reported_reason")
    private String reportedReason;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Report id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContentType() {
        return this.contentType;
    }

    public Report contentType(String contentType) {
        this.setContentType(contentType);
        return this;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getContentID() {
        return this.contentID;
    }

    public Report contentID(String contentID) {
        this.setContentID(contentID);
        return this;
    }

    public void setContentID(String contentID) {
        this.contentID = contentID;
    }

    public String getContentAuthor() {
        return this.contentAuthor;
    }

    public Report contentAuthor(String contentAuthor) {
        this.setContentAuthor(contentAuthor);
        return this;
    }

    public void setContentAuthor(String contentAuthor) {
        this.contentAuthor = contentAuthor;
    }

    public String getReportedBy() {
        return this.reportedBy;
    }

    public Report reportedBy(String reportedBy) {
        this.setReportedBy(reportedBy);
        return this;
    }

    public void setReportedBy(String reportedBy) {
        this.reportedBy = reportedBy;
    }

    public Instant getReportedTime() {
        return this.reportedTime;
    }

    public Report reportedTime(Instant reportedTime) {
        this.setReportedTime(reportedTime);
        return this;
    }

    public void setReportedTime(Instant reportedTime) {
        this.reportedTime = reportedTime;
    }

    public String getReportedReason() {
        return this.reportedReason;
    }

    public Report reportedReason(String reportedReason) {
        this.setReportedReason(reportedReason);
        return this;
    }

    public void setReportedReason(String reportedReason) {
        this.reportedReason = reportedReason;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Report)) {
            return false;
        }
        return id != null && id.equals(((Report) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Report{" +
            "id=" + getId() +
            ", contentType='" + getContentType() + "'" +
            ", contentID='" + getContentID() + "'" +
            ", contentAuthor='" + getContentAuthor() + "'" +
            ", reportedBy='" + getReportedBy() + "'" +
            ", reportedTime='" + getReportedTime() + "'" +
            ", reportedReason='" + getReportedReason() + "'" +
            "}";
    }
}
